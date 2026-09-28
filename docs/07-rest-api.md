# ClientCare — PostgreSQL and REST API

## Purpose

The API exposes the client-profile workflow while preserving three rules:

- every client query belongs to one coordinator;
- follow-up status is calculated from dates instead of stored;
- archiving is reversible and never deletes profile history.

All request and response bodies use JSON. PostgreSQL `bigint` identifiers are returned as strings.

## Local database

Start PostgreSQL:

```bash
docker compose up -d database
```

Apply the initial schema and fictional development coordinator:

```bash
npm run db:setup
```

The seed creates a fictional coordinator account for local authentication tests.

## Health endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API liveness check |
| `GET` | `/api/health/database` | PostgreSQL readiness check |

## Client endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/clients` | List the coordinator's clients |
| `GET` | `/api/clients/:clientId` | Retrieve one owned client |
| `POST` | `/api/clients` | Create a client |
| `PATCH` | `/api/clients/:clientId` | Update approved client fields |
| `POST` | `/api/clients/:clientId/archive` | Archive a client |
| `POST` | `/api/clients/:clientId/restore` | Restore an archived client |

There is deliberately no permanent-delete endpoint in the MVP.

## List filters

`GET /api/clients` accepts:

| Parameter | Values | Default |
| --- | --- | --- |
| `status` | `active`, `all`, `archived`, `not_scheduled`, `upcoming`, `due_today`, `overdue` | `active` |
| `search` | Name, email or phone fragment | omitted |
| `cursor` | Last client ID from the previous page | omitted |
| `limit` | Integer from 1 to 100 | `25` |

The response uses cursor pagination:

```json
{
  "data": [],
  "page": {
    "limit": 25,
    "nextCursor": null
  }
}
```

## Create-client example

```http
POST /api/clients
Content-Type: application/json

{
  "firstName": "Noa",
  "lastName": "Levi",
  "email": "noa.levi@example.test",
  "phone": "+972-50-000-0000",
  "identifiedNeeds": ["Health insurance registration"],
  "missingInformation": ["Arrival date"],
  "lastContactDate": "2026-09-20",
  "nextFollowUpDate": "2026-09-30"
}
```

The server trims text, normalizes email to lowercase, validates calendar dates and rejects unknown or malformed values.

## Ownership and authentication boundary

Repository queries always include both client ID and coordinator ID. A coordinator cannot retrieve, update, archive or restore a client owned by another account simply by guessing its ID.

The API resolves the coordinator ID from a verified session token. No request body, URL parameter or custom development header may choose the profile owner.

## Connection strategy

- One shared application pool is used instead of one connection per request.
- Pool size is limited by `DATABASE_POOL_MAX`.
- Idle and connection timeouts prevent abandoned connections.
- PostgreSQL sessions use `APP_TIME_ZONE` so `current_date` produces the correct follow-up status.
- The process closes the pool during graceful shutdown.
