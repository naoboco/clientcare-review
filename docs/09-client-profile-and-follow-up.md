# ClientCare — Client Profiles and Follow-up Alerts

## Profile workflow

The coordinator can:

1. Open the Clients page and search or filter profiles.
2. Create a profile with contact details, summary, needs and follow-up dates.
3. Open a profile to review its calculated follow-up status.
4. Edit the profile when information changes.
5. Archive a profile without deleting it.
6. Restore an archived profile when follow-up resumes.

The client form uses the same component for creation and editing, which keeps validation and field behavior consistent.

## Follow-up states

The interface displays the status returned by the API:

| State | Meaning | Visual treatment |
| --- | --- | --- |
| `overdue` | The follow-up date has passed | Red badge and dashboard priority |
| `due_today` | The follow-up is scheduled today | Amber badge and dashboard priority |
| `upcoming` | The follow-up is in the future | Mint badge |
| `not_scheduled` | No next follow-up date exists | Neutral badge |
| `archived` | The profile is archived | Neutral badge |

Status is calculated by PostgreSQL from the date. The client never invents or stores a separate status value.

## Dashboard behavior

The dashboard loads active clients once, counts overdue, due-today and upcoming profiles, and shows up to five urgent profiles. Each row links to the full profile so the coordinator can act without searching again.

## Search and pagination

The Clients page sends the search text and selected status to the REST API. A short debounce prevents one request per keystroke. The API returns a cursor for the next page; loading more appends results to the current list.

## Accessibility decisions

- Tables use a caption, column headers and semantic rows.
- Status is written as text, not represented by color alone.
- Form fields have visible labels.
- Error messages use `role="alert"`.
- Loading states use `role="status"` where appropriate.
- The layout switches to a compact one-column form on small screens.
