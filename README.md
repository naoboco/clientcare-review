# ClientCare

**Follow every client. Miss no next step.**

ClientCare is a full-stack client follow-up platform for coordinators. It centralizes client profiles, tracks last-contact and next-follow-up dates, highlights overdue follow-ups, and uses Gemini to turn fictional emails into structured suggestions that must be reviewed by a human before they are saved.

## Core problem

When client follow-up is managed across spreadsheets and emails, quiet clients can be forgotten. ClientCare gives coordinators a clear daily view of who requires attention and what should happen next.

## MVP

- Secure registration, login and logout
- Coordinator dashboard
- Create, view, update and archive client profiles
- Record last-contact and next-follow-up dates
- Display due-today and overdue follow-ups inside the application
- Analyze fictional emails with Gemini
- Review, edit, confirm or reject AI-generated suggestions
- Responsive and accessible interface

## Additional features

- Search and filter client profiles
- Visual statistics
- Multiple coordinator accounts
- CSV export
- Email templates
- Advanced AI priority scoring

## Planned stack

- React
- TypeScript
- Redux Toolkit
- Node.js
- Express
- PostgreSQL
- Gemini API
- JSON REST API

Python is not required for the initial architecture and will only be introduced if a concrete use case appears.

## Privacy and AI principles

- Development and demonstrations use fictional data only.
- Gemini never writes directly to a client profile.
- Every AI-generated suggestion requires human review and confirmation.
- No legal, medical or financial eligibility decision is delegated to AI.

## Project documentation

- [CRM and case-management research](docs/01-crm-research.md)
- [Requirements and user workflow](docs/02-requirements-and-user-workflow.md)
- [Visual identity](docs/03-visual-identity.md)
- [Main page wireframes](docs/04-wireframes.md)
- [Database structure](docs/05-database-schema.md)
- [Reusable UI component system](docs/06-component-system.md)
- [PostgreSQL and REST API](docs/07-rest-api.md)
- [Authentication](docs/08-authentication.md)

## Local development

Requirements: Node.js 22.12 or newer and npm.

```bash
git clone https://github.com/naoboco/clientcare-review.git
cd clientcare-review
npm install
cp .env.example .env
```

Start PostgreSQL and initialize the schema:

```bash
docker compose up -d database
npm run db:setup
```

Start the API in one terminal:

```bash
npm run dev:server
```

Start the React application in a second terminal:

```bash
npm run dev:client
```

The application runs at `http://localhost:5173`. The API health endpoint is available at `http://localhost:3000/api/health`.

The fictional local account created by `npm run db:setup` uses `coordinator@clientcare.demo` and password `ClientCareDemo2026!`.

## Current status

- [x] Research similar CRM and case-management platforms
- [x] Define project requirements and user workflow
- [x] Define visual identity, colors, typography and interface style
- [x] Create wireframes for the main pages
- [x] Design the database structure
- [x] Design a reusable UI component system
- [x] Set up the React and TypeScript front end
- [x] Set up the Node.js and Express back end
- [x] Create the PostgreSQL database and REST API
- [x] Implement registration, login and protected routes
- [ ] Develop client profile creation, viewing, editing and archiving
- [ ] Implement follow-up date management and overdue alerts
- [ ] Integrate structured Gemini email analysis
- [ ] Implement human review and confirmation
- [ ] Create fictional profiles and emails
- [ ] Test, deploy and document the application

## Repository

Final project for the Developers Institute Full-Stack & AI Bootcamp.
