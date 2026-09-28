# ClientCare — Authentication

## Authentication flow

ClientCare uses short-lived JSON Web Tokens stored in an HTTP-only cookie:

1. A coordinator registers or submits valid login credentials.
2. The server signs an eight-hour session token containing only the user ID.
3. The browser receives the token in `clientcare_session`.
4. Protected API requests send the cookie automatically.
5. The server verifies signature, expiration, issuer and audience before exposing the coordinator ID to a route.
6. Logout clears the session cookie.

The React application never reads or stores the token in JavaScript, `localStorage` or Redux.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a coordinator account and session |
| `POST` | `/api/auth/login` | Verify credentials and create a session |
| `POST` | `/api/auth/logout` | Clear the session cookie |
| `GET` | `/api/auth/me` | Restore the authenticated user |

## Registration body

```json
{
  "name": "Noa Levi",
  "email": "noa.levi@example.test",
  "password": "a-secure-password"
}
```

Names and emails are trimmed, emails are normalized to lowercase, and passwords require at least 12 characters without exceeding bcrypt's 72-byte input limit.

## Security controls

- Passwords are hashed with bcrypt cost factor 12.
- Login errors never reveal whether the email exists.
- A dummy password comparison reduces account-enumeration timing differences.
- Registration and login are limited to 20 attempts per 15 minutes per source.
- Session cookies are HTTP-only and `SameSite=Strict`.
- Production cookies require HTTPS through the `Secure` flag.
- Production startup rejects the public development JWT secret.
- Protected client queries still include the authenticated coordinator ID.
- The client sends authenticated requests with `credentials: include`.

## Local demo account

After `npm run db:setup`, the fictional account is:

```text
Email: coordinator@clientcare.demo
Password: ClientCareDemo2026!
```

This account and password are development fixtures only.

## Front-end behavior

- The application checks `/api/auth/me` once when it starts.
- Unauthenticated visitors are redirected to `/login`.
- Authenticated visitors cannot return to `/login` or `/register` without logging out.
- A successful login returns the visitor to the originally requested protected page.
- Redux stores only the public user profile and authentication state.

## Deferred production hardening

Server-side session revocation, password reset, email verification and multi-factor authentication remain outside the MVP. They can be introduced later without changing the current client ownership model.
