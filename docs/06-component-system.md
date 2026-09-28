# ClientCare — Reusable UI Component System

## Objective

Build the interface from a small, consistent set of typed components so that dashboard, client and AI screens share the same behavior and visual rules.

## Component layers

### 1. UI primitives

Generic components with no ClientCare business logic:

- `Button`
- `TextInput`
- `TextArea`
- `DateInput`
- `FormField`
- `Badge`
- `Dialog`
- `Toast`
- `Spinner`
- `EmptyState`
- `ErrorState`

### 2. Layout components

- `AppShell`
- `Sidebar`
- `TopBar`
- `PageHeader`
- `ContentSection`
- `ProtectedRoute`

### 3. Domain components

Components that understand ClientCare data:

- `StatCard`
- `StatusBadge`
- `ClientTable`
- `ClientCard`
- `ClientForm`
- `FollowUpPanel`
- `ClientSummaryPanel`
- `EmailAnalysisForm`
- `AIReviewPanel`

## Page composition

| Page | Main components |
| --- | --- |
| Register | `AuthLayout`, `FormField`, `TextInput`, `Button` |
| Login | `AuthLayout`, `FormField`, `TextInput`, `Button` |
| Dashboard | `AppShell`, `PageHeader`, `StatCard`, `ClientTable` |
| Clients | `AppShell`, `PageHeader`, `ClientTable`, `ClientCard` |
| Client profile | `AppShell`, `PageHeader`, `ClientSummaryPanel`, `FollowUpPanel` |
| Create/edit client | `AppShell`, `PageHeader`, `ClientForm` |
| Analyze email | `AppShell`, `PageHeader`, `EmailAnalysisForm` |
| Review AI output | `AppShell`, `PageHeader`, `AIReviewPanel` |

## Planned routes

```text
/register
/login
/dashboard
/clients
/clients/new
/clients/:clientId
/clients/:clientId/edit
/clients/:clientId/analyze
```

The AI review is a controlled state inside the analyze route. This prevents unconfirmed analysis data from being treated as a permanent URL resource.

## Suggested front-end structure

```text
client/src/
├── app/
│   ├── router.tsx
│   ├── store.ts
│   └── api.ts
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── PageHeader.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Dialog.tsx
│       ├── EmptyState.tsx
│       ├── FormField.tsx
│       ├── Spinner.tsx
│       ├── StatusBadge.tsx
│       ├── TextArea.tsx
│       └── TextInput.tsx
├── features/
│   ├── auth/
│   │   ├── authApi.ts
│   │   ├── authSlice.ts
│   │   └── types.ts
│   ├── clients/
│   │   ├── ClientCard.tsx
│   │   ├── ClientForm.tsx
│   │   ├── ClientTable.tsx
│   │   ├── FollowUpPanel.tsx
│   │   ├── clientsApi.ts
│   │   └── types.ts
│   └── ai/
│       ├── AIReviewPanel.tsx
│       ├── EmailAnalysisForm.tsx
│       ├── aiApi.ts
│       └── types.ts
├── pages/
│   ├── AnalyzeEmailPage.tsx
│   ├── ClientFormPage.tsx
│   ├── ClientPage.tsx
│   ├── ClientsPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── styles/
│   ├── globals.css
│   └── tokens.css
└── main.tsx
```

## TypeScript domain types

```ts
export type FollowUpStatus =
  | 'not_scheduled'
  | 'upcoming'
  | 'due_today'
  | 'overdue'
  | 'archived'

export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  summary: string | null
  identifiedNeeds: string[]
  missingInformation: string[]
  suggestedNextAction: string | null
  lastContactDate: string | null
  nextFollowUpDate: string | null
  followUpStatus: FollowUpStatus
  daysOverdue: number
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AIAnalysisDraft {
  summary: string
  identifiedNeeds: string[]
  missingInformation: string[]
  suggestedNextAction: string
}
```

## Key component contracts

### `Button`

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
```

Supports native button props, loading state and an optional icon. Only one primary button should appear in the same action group.

### `StatusBadge`

```ts
interface StatusBadgeProps {
  status: FollowUpStatus
  daysOverdue?: number
}
```

It owns the status label, icon and color mapping so pages cannot represent the same status inconsistently.

### `ClientTable`

```ts
interface ClientTableProps {
  clients: Client[]
  onOpenClient: (clientId: number) => void
}
```

Desktop renders a semantic table. Mobile renders `ClientCard` elements with the same information.

### `ClientForm`

```ts
interface ClientFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  summary: string
  lastContactDate: string
  nextFollowUpDate: string
}
```

The same form supports create and edit modes.

### `AIReviewPanel`

```ts
interface AIReviewPanelProps {
  draft: AIAnalysisDraft
  isSaving: boolean
  onChange: (draft: AIAnalysisDraft) => void
  onConfirm: () => void
  onReject: () => void
}
```

The component always displays an AI warning and editable values. It never saves automatically.

## State ownership

### Redux Toolkit and RTK Query

Use Redux Toolkit for:

- authenticated-user state;
- API endpoints and cache;
- global session transitions.

Use RTK Query for:

- client list;
- client details;
- dashboard summary;
- mutations for create, update and archive;
- Gemini analysis and confirmation requests.

### Local React state

Use local state for:

- unsaved form values;
- current AI review draft;
- dialog open or closed state;
- temporary validation messages.

Unconfirmed Gemini output must never enter the permanent global client cache.

## Design tokens

The CSS token file will contain:

```css
:root {
  --color-navy-900: #14213d;
  --color-blue-600: #2563eb;
  --color-blue-100: #dbeafe;
  --color-mint-600: #067647;
  --color-background: #f6f8fc;
  --color-surface: #ffffff;
  --color-border: #d9e1ec;
  --color-text-primary: #172033;
  --color-text-secondary: #667085;
  --radius-button: 8px;
  --radius-card: 12px;
}
```

Status tokens will be centralized beside these brand tokens.

## Required component states

Every data-driven page must define:

- loading;
- success;
- empty;
- validation error;
- server error;
- unauthorized session.

Buttons that trigger network operations must prevent duplicate submissions while loading.

## Accessibility contract

- Components forward native semantic attributes.
- `FormField` connects labels, descriptions and validation errors.
- `Dialog` traps focus and restores it on close.
- `StatusBadge` includes readable text.
- `Toast` uses an appropriate live region.
- Mobile targets remain at least 44px.
- Reduced-motion preferences are respected.

## Task 6 completion criteria

- Component layers defined: complete.
- Page composition defined: complete.
- Routes defined: complete.
- Front-end folders defined: complete.
- Domain types drafted: complete.
- State ownership defined: complete.
- Accessibility contract defined: complete.

