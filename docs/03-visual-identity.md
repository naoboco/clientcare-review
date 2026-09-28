# ClientCare — Visual Identity

## 1. Design direction

**Calm professional**

ClientCare should feel reliable, clear and human. The interface must help a coordinator notice urgency without creating constant visual stress.

Design keywords:

- calm;
- trustworthy;
- organized;
- modern;
- human;
- accessible;
- action-oriented.

Avoid:

- excessive gradients;
- neon colors;
- heavy shadows;
- dense enterprise-style screens;
- decorative animation;
- color-only status communication.

## 2. Brand concept

### Name

**ClientCare**

### Product sentence

**Follow every client. Miss no next step.**

### Logo direction

A simple wordmark with a compact symbol combining:

- the letter **C**;
- a check mark;
- a subtle clock or follow-up cue.

The mark should work at favicon size and must not resemble a hospital logo.

## 3. Color palette

### Brand colors

| Token | Hex | Use |
| --- | --- | --- |
| `navy-900` | `#14213D` | Sidebar, headings, primary text |
| `blue-600` | `#2563EB` | Primary buttons, active navigation, links |
| `blue-100` | `#DBEAFE` | Selected rows, informational backgrounds |
| `mint-600` | `#067647` | Positive confirmation and supporting accent |
| `mint-100` | `#DDF7EE` | Success background |

### Neutral colors

| Token | Hex | Use |
| --- | --- | --- |
| `surface` | `#FFFFFF` | Cards, modals, forms |
| `background` | `#F6F8FC` | Application background |
| `border` | `#D9E1EC` | Dividers and input borders |
| `text-primary` | `#172033` | Main body text |
| `text-secondary` | `#667085` | Supporting text |
| `text-muted` | `#8A94A6` | Metadata and placeholders |

### Follow-up status colors

| Status | Foreground | Background | Additional cue |
| --- | --- | --- | --- |
| Overdue | `#B42318` | `#FEE4E2` | Alert icon + “Overdue” label |
| Due today | `#B54708` | `#FEF0C7` | Clock icon + “Due today” label |
| Upcoming | `#175CD3` | `#EAF2FF` | Calendar icon + “Upcoming” label |
| Not scheduled | `#475467` | `#F2F4F7` | Minus-circle icon + label |
| Archived | `#667085` | `#EAECF0` | Archive icon + label |

Status must never be communicated through color alone.

## 4. Typography

### Font family

Use **Inter** for the complete interface.

Fallback:

```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Type scale

| Style | Size | Weight | Use |
| --- | --- | --- | --- |
| Display | 32px | 700 | Login and onboarding heading |
| Page title | 24px | 700 | Dashboard and page titles |
| Section title | 18px | 600 | Card and form sections |
| Body | 16px | 400 | Standard readable content |
| Small | 14px | 400 or 500 | Metadata, table details |
| Caption | 12px | 500 | Tags and secondary labels |

Use a minimum 16px font size in form inputs to maintain mobile readability.

## 5. Layout

### Desktop

- Fixed left sidebar: 240px.
- Top bar containing page context and user menu.
- Main content on a soft-grey background.
- Maximum content width: approximately 1440px.
- 24px page padding and 20–24px gaps between sections.
- Cards use a white surface, 1px border and restrained shadow.

### Tablet

- Collapsible sidebar.
- Two-column dashboard cards where space permits.
- Client table may scroll horizontally.

### Mobile

- Sidebar becomes a drawer.
- Dashboard cards stack vertically or use a two-column compact grid.
- Client table becomes a list of client cards.
- Primary actions remain easy to reach.
- Minimum interactive target: 44px.

## 6. Shape and elevation

| Element | Radius | Shadow |
| --- | --- | --- |
| Buttons | 8px | None or very subtle |
| Inputs | 8px | None |
| Cards | 12px | `0 1px 3px rgba(16, 24, 40, 0.08)` |
| Modals | 16px | Medium overlay shadow |
| Status badges | Full pill | None |

The interface should appear structured through spacing and borders, not heavy shadows.

## 7. Main navigation

MVP sidebar items:

1. Dashboard
2. Clients
3. Analyze email

Secondary area:

- profile/account;
- logout.

Additional features such as statistics, templates and administration must not appear as inactive navigation clutter in the MVP.

## 8. Reusable visual components

### Primary components

- `AppShell`
- `Sidebar`
- `TopBar`
- `PageHeader`
- `StatCard`
- `ClientTable`
- `ClientCard`
- `StatusBadge`
- `Button`
- `TextInput`
- `TextArea`
- `DateInput`
- `FormField`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `ConfirmDialog`
- `Toast`
- `AIAnalysisForm`
- `AIReviewPanel`

### Button hierarchy

- **Primary:** solid blue, for one principal action per section.
- **Secondary:** white with border, for safe alternate actions.
- **Destructive:** red text or red background only when archiving is confirmed.
- **Ghost:** text-only navigation or tertiary action.

## 9. Dashboard visual hierarchy

Order of attention:

1. Page title and primary **Add client** action.
2. Overdue and due-today summary cards.
3. Prioritized client list.
4. Total active and unscheduled counts.
5. Secondary shortcuts.

Overdue information should be easy to notice but should not flood the whole screen with red.

## 10. AI review interface

The AI feature must look like a review process, not an authoritative answer.

The review screen includes:

- a visible **AI-generated suggestion** label;
- editable fields for every suggestion;
- a short warning that the user must verify accuracy;
- **Reject suggestions** as a secondary action;
- **Confirm and save** as the primary action;
- no automatic saving;
- clear loading and error states.

## 11. Content style

Interface text should be concise and concrete.

Preferred:

- “Next follow-up”
- “12 days overdue”
- “Confirm and save”
- “No follow-up scheduled”

Avoid:

- vague labels such as “Process” or “Action item” without context;
- guilt-inducing messages;
- overly friendly AI language;
- technical API language in user-facing errors.

## 12. Accessibility rules

- Target WCAG AA contrast.
- Keep a visible keyboard focus ring.
- Pair every icon with text or an accessible label.
- Use semantic headings and landmarks.
- Show validation messages next to the relevant field.
- Use `aria-live` for important success or error feedback.
- Respect reduced-motion preferences.

## Task 3 completion criteria

- Design direction selected: complete.
- Color system defined: complete.
- Typography defined: complete.
- Responsive layout principles defined: complete.
- Component appearance rules defined: complete.
- AI review visual principles defined: complete.
- Accessibility rules defined: complete.
