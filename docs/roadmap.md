# Roadmap

## Branch Strategy

Use semantic branches without `codex/`:

| Phase | Branch | Purpose |
| --- | --- | --- |
| Pre-development | `docs/pre-development` | Documentation, AGENTS.md, skills, diagrams |
| Etapa 1 | `feat/dashboard-financeiro` | Setup and financial dashboard |
| Etapa 2 | `feat/invoicing` | Invoice list, filters, detail, actions |
| Etapa 3 | `feat/payments-accounts` | Payments, AR, AP |
| Etapa 4 | `feat/statements-reports` | Statements and analytics reports |
| Etapa 5 | `feat/automations` | Bonus automations and polish |

Multiple commits are allowed per branch. Use Conventional Commits and keep each commit focused.

## Suggested Timeline

### Day 1 - Setup and Dashboard

- Scaffold Next.js with TypeScript and Tailwind.
- Set base layout, theme tokens, and navigation.
- Build dashboard KPIs, charts, AR aging, top customers, and activity feed.
- Use realistic mock data if Supabase is not ready yet.

### Day 2 - Invoicing List

- Define invoice and line item data model.
- Build invoice list, search, status filters, summary cards, and invoice table.
- Create semantic status badges.

### Day 3 - Invoice Detail and Payments

- Build invoice detail route.
- Add line items, totals, payment history, QuickBooks sync indicator, and action panel.
- Build payments list and register payment flow.

### Day 4 - AR and AP

- Build aging analysis, customer balance bars, open invoice reminders.
- Build vendor AP table and summary cards.
- Confirm categories match jewelry operations.

### Day 5 - Statements, Reports, Automations, Deploy

- Build statement date range flow and customer statement cards.
- Build report selector and analytics views.
- Add selected automation bonuses.
- Prepare README, screenshots, deploy, and presentation notes.

## Commit Examples

- `docs: add pre-development structure`
- `docs: map technical test requirements`
- `docs: add architecture and data diagrams`
- `chore: register agent skill workflow`
- `feat: add dashboard financial KPIs`
- `feat: add invoice status filters`
- `test: cover invoice filtering`
- `fix: correct overdue balance calculation`

## Definition of Ready

A feature branch is ready to start when:

- Its requirements are mapped in `docs/requirements.md`.
- Its tasks are listed in `docs/tasks.md`.
- Needed skills are known from `AGENTS.md`.
- The branch name follows the roadmap.

## Definition of Done

A feature branch is done when:

- The feature meets the acceptance criteria.
- Tests/checks for that feature pass.
- AI usage is recorded when material.
- Documentation is updated for any changed decision.
- No secrets or confidential PDFs are staged.

