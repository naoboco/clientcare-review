# ClientCare — CRM and Case-Management Research

## Objective

Identify the interaction patterns used by established CRM and case-management products, then select only the elements that support ClientCare's core promise: no client should be forgotten because they did not initiate contact.

## Products reviewed

### HubSpot CRM

Useful patterns:

- A contact record combines key information with an activity timeline.
- Tasks have due dates and reminders.
- Task queues help users work through follow-ups in a defined order.
- Activities such as notes, calls, meetings and emails remain attached to the contact record.

Decision for ClientCare:

- Use one client profile as the central source of truth.
- Show the most important dates and status at the top of the profile.
- Keep follow-up information visible without requiring the user to search through emails.

### Salesforce Service Cloud

Useful patterns:

- A case record centralizes the full customer history.
- Milestones distinguish upcoming, completed and overdue actions.
- Support agents receive context before acting on a case.
- Timeline views make the sequence of events understandable.

Decision for ClientCare:

- Treat the next follow-up date as a lightweight milestone.
- Calculate the follow-up state automatically: upcoming, due today or overdue.
- Make overdue cases visually prominent on the dashboard.

### monday CRM

Useful patterns:

- Date columns can trigger reminders.
- Emails and activities can appear together in a timeline.
- Recent activity can update a last-contact date.
- AI can summarize an email and activity timeline.

Decision for ClientCare:

- Use clear dashboard cards and status chips.
- Keep reminders inside the application for the MVP.
- Ask Gemini for structured fields rather than an unstructured paragraph.

### Zoho CRM

Useful patterns:

- Workflow rules connect conditions to tasks, notifications and field updates.
- Tasks may include a due date and reminder.
- Repetitive follow-up actions can be automated.

Decision for ClientCare:

- Use a simple deterministic rule for MVP alerts: if the next follow-up date is before today and the profile is active, it is overdue.
- Avoid a generic workflow builder in the MVP because it would greatly increase scope.

### Zendesk

Useful patterns:

- The agent workspace keeps customer context next to the active case.
- The interaction history helps agents understand the situation quickly.
- Context is displayed at the moment the agent needs to act.

Decision for ClientCare:

- Design the client page with a summary panel and follow-up panel visible together.
- Keep detailed history as an additional feature, not a requirement for the first working version.

## Patterns selected for ClientCare

| Pattern | ClientCare implementation | MVP status |
| --- | --- | --- |
| Central client record | One profile containing identity, summary and follow-up dates | Required |
| Follow-up milestone | Last-contact and next-follow-up dates | Required |
| Overdue detection | Automatic status based on today's date | Required |
| Action dashboard | Cards and a prioritized overdue-client list | Required |
| AI email summary | Gemini returns structured JSON fields | Required |
| Human approval | User edits, confirms or rejects AI suggestions before saving | Required |
| Search and filters | Search by name and filter by follow-up status | Additional |
| Activity timeline | Chronological notes and interactions | Additional |
| External notifications | Email or push reminders | Excluded from MVP |
| Workflow builder | User-defined automation rules | Excluded from MVP |

## Product principles

1. **Clarity before density** — the next action must be visible in seconds.
2. **Urgency must be explainable** — the interface shows why a client is overdue.
3. **AI suggests; humans decide** — Gemini never writes directly to a client profile.
4. **Privacy by design** — development and demonstrations use fictional data only.
5. **A narrow working MVP beats a broad unfinished CRM** — advanced collaboration and automation remain optional.

## Initial dashboard recommendation

The first dashboard should contain:

- total active clients;
- follow-ups due today;
- overdue follow-ups;
- clients without a scheduled follow-up;
- a prioritized table of clients requiring attention;
- one clear action button: **Add client**.

## Sources

- HubSpot, Create tasks: https://knowledge.hubspot.com/tasks/create-tasks
- HubSpot, Task reminders and daily digest: https://knowledge.hubspot.com/tasks/task-reminders-and-daily-digest
- HubSpot, Record page layout and activity timeline: https://knowledge.hubspot.com/records/work-with-records
- Salesforce, Set up and manage cases: https://help.salesforce.com/s/articleView?id=sf.cases_intro.htm&language=en_US&type=5
- Salesforce, Milestone tracker: https://help.salesforce.com/s/articleView?id=entitlements_milestone_tracker.htm&language=en_US
- monday CRM, Emails and Activities: https://support.monday.com/hc/en-us/articles/4409766475666-Emails-Activities-manage-your-activities
- monday CRM, Alerts and reminders: https://support.monday.com/hc/en-us/articles/360000227739-Alerts-and-Reminders-with-Automations
- monday CRM, AI features: https://support.monday.com/hc/en-us/articles/25548698480914-monday-CRM-s-AI-features
- Zoho CRM, Workflow rules: https://help.zoho.com/portal/en/kb/crm/automate-business-processes/workflows/articles/configuring-workflow-rules
- Zendesk, Customer context: https://support.zendesk.com/hc/en-us/articles/4408829170458-Viewing-customer-context-for-user-history-and-device-information

## Task 1 completion criteria

- Comparable products reviewed: complete.
- Reusable interaction patterns identified: complete.
- MVP boundaries clarified: complete.
- Design decisions recorded: complete.

