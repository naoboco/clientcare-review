# ClientCare — Requirements and User Workflow

## 1. Product goal

ClientCare helps a coordinator answer three questions immediately:

1. Which clients require attention today?
2. What is the next action for each client?
3. What useful information can be extracted from a client email, subject to human review?

## 2. MVP user

### Coordinator

The coordinator is the only application user in the MVP. The coordinator can:

- register, log in and log out;
- view a dashboard;
- create and manage client profiles;
- record last-contact and next-follow-up dates;
- identify overdue follow-ups;
- paste a fictional email for Gemini analysis;
- edit, confirm or reject AI-generated suggestions;
- archive a client without permanently deleting the record.

Clients do not have accounts in the MVP.

## 3. MVP pages

1. **Register** — create a coordinator account.
2. **Login** — authenticate an existing coordinator.
3. **Dashboard** — view counts and the clients requiring attention.
4. **Clients** — view the client list.
5. **New client** — create a client profile.
6. **Client details** — view one client's information and follow-up state.
7. **Edit client** — update profile and follow-up information.
8. **Analyze email** — paste fictional email text and request Gemini analysis.
9. **Review analysis** — inspect, edit, confirm or reject Gemini suggestions.

Search, filters, statistics, CSV export, email templates and multi-coordinator assignment are additional features.

## 4. Core client information

Each active client profile contains:

- first name;
- last name;
- email address;
- phone number (optional);
- short situation summary (optional);
- last-contact date (optional);
- next-follow-up date (optional);
- lifecycle state: active or archived;
- creation date;
- last update date;
- owner coordinator.

## 5. Follow-up rules

The follow-up state is calculated, not manually selected.

| Condition | Follow-up state | Display |
| --- | --- | --- |
| No next-follow-up date | Not scheduled | Neutral grey |
| Date is after today | Upcoming | Blue |
| Date is today | Due today | Amber |
| Date is before today and client is active | Overdue | Red |
| Client is archived | Archived | Muted grey |

Dates are interpreted in the user's local timezone. Archived clients do not appear in dashboard alert counts.

## 6. Dashboard requirements

The dashboard displays:

- total active clients;
- follow-ups due today;
- overdue follow-ups;
- clients without a scheduled follow-up;
- a prioritized list containing overdue clients first, then clients due today;
- an **Add client** action;
- an **Analyze email** action.

For each client requiring attention, display:

- full name;
- last-contact date;
- next-follow-up date;
- follow-up state;
- number of days overdue when applicable;
- a button to open the profile.

## 7. User workflows

### Workflow A — Register and log in

1. The coordinator creates an account with a name, email and password.
2. The server validates the input.
3. The password is hashed before storage.
4. The coordinator logs in.
5. The server creates a secure authenticated session.
6. Protected pages become accessible.

### Workflow B — Create a client

1. The coordinator opens **New client**.
2. The coordinator enters the required identity fields.
3. The coordinator may add a summary and follow-up dates.
4. The form validates the information.
5. The API creates the profile.
6. The application redirects to the new client profile.

### Workflow C — Daily follow-up

1. The coordinator opens the dashboard.
2. The application calculates follow-up states using today's date.
3. Overdue profiles appear first.
4. The coordinator opens a profile.
5. After contacting the client, the coordinator updates the last-contact date.
6. The coordinator selects a new next-follow-up date.
7. The dashboard status updates automatically.

### Workflow D — Analyze an email with Gemini

1. The coordinator opens **Analyze email** from a client profile.
2. The coordinator pastes fictional email text.
3. The back end sends the text and a strict response schema to Gemini.
4. Gemini returns structured suggestions.
5. The application displays the suggestions in editable fields.
6. No generated information is saved yet.
7. The coordinator may edit, confirm or reject the suggestions.
8. Only confirmed information is saved to the client profile.

## 8. Gemini response structure

The MVP requests the following fields:

```json
{
  "summary": "Short factual summary",
  "identifiedNeeds": ["Need one", "Need two"],
  "missingInformation": ["Missing item"],
  "suggestedNextAction": "One concrete follow-up action"
}
```

Gemini must not:

- invent facts absent from the email;
- update the database directly;
- contact a client;
- determine legal, medical or financial eligibility;
- process real confidential data in the demonstration.

## 9. Functional requirements

### Authentication

- The user can register with valid information.
- Duplicate email addresses are rejected.
- Passwords are never stored in plain text.
- Invalid login attempts return a generic error.
- Protected API routes reject unauthenticated requests.
- The user can log out.

### Client profile management

- The user can create a client.
- The user can view all non-archived clients.
- The user can view one client.
- The user can update a client.
- The user can archive a client.
- The user can deliberately view archived clients outside the default dashboard.

### Follow-up management

- The user can save a last-contact date.
- The user can save or clear a next-follow-up date.
- The application calculates the follow-up state consistently.
- The dashboard reflects date changes without manual status editing.

### AI analysis

- Empty email text is rejected.
- The server validates Gemini's response structure.
- The user sees an explicit review step.
- Suggestions remain editable before confirmation.
- Rejecting suggestions stores nothing.
- Confirming suggestions stores only the approved values.

## 10. Non-functional requirements

### Security

- Hash passwords with bcrypt.
- Validate and sanitize API inputs.
- Keep API keys and database credentials in environment variables.
- Never expose the Gemini API key in the React application.
- Apply authentication middleware to protected routes.
- Avoid permanent deletion in normal coordinator workflows.

### Privacy

- Use fictional clients and emails during development, testing and demonstration.
- Display a reminder above the email-analysis field not to paste real confidential data.
- Avoid logging passwords, tokens or full email contents.

### Accessibility

- Support keyboard navigation.
- Use visible focus indicators.
- Associate labels with all form controls.
- Do not communicate status through color alone.
- Maintain readable contrast.

### Responsiveness

- The application must work on desktop and mobile widths.
- Tables must become readable cards or horizontally scroll safely on narrow screens.
- Primary actions must remain accessible without precise pointer control.

## 11. MVP acceptance scenario

The MVP is considered functionally complete when a reviewer can:

1. register and log in;
2. create a fictional client;
3. set a next-follow-up date in the past;
4. see that client appear as overdue on the dashboard;
5. update the follow-up date and see the status change;
6. paste a fictional email;
7. receive structured Gemini suggestions;
8. edit and confirm those suggestions;
9. reopen the client profile and see the approved information;
10. archive the client and see it disappear from active dashboard counts;
11. log out and lose access to protected pages.

## 12. Explicitly excluded from the MVP

- Direct Gmail or Outlook connection.
- Real client data.
- Email, SMS, WhatsApp or push notifications.
- Multiple user roles and team assignment.
- Advanced automatic priority scoring.
- Custom workflow automation builder.
- CSV export.
- Full interaction timeline.
- Client portal.

## Task 2 completion criteria

- User and scope defined: complete.
- Core pages defined: complete.
- Follow-up business rules defined: complete.
- AI review workflow defined: complete.
- Acceptance scenario defined: complete.
- MVP exclusions defined: complete.

