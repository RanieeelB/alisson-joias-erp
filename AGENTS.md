# AGENTS.md

## Project Context

This repository is for the Alisson Joias junior full stack technical test: a finance module for a jewelry ERP inspired by PIRO Fusion. The delivery must demonstrate strategic AI-assisted development, clean Next.js 14+ code, Supabase usage, Tailwind CSS styling, realistic jewelry finance data, and a clear Git history.

The original PDFs are confidential and must not be copied into this repository. Use the summaries in `docs/` as the working source of truth.

## Source of Truth

Before implementing or reviewing any feature, read:

1. `docs/pre-development.md`
2. `docs/requirements.md`
3. `docs/architecture.md`
4. `docs/data-model.md`
5. `docs/roadmap.md`
6. `docs/tasks.md`
7. `docs/visual-direction.md`

If a requirement conflicts with an implementation idea, follow the test requirements first.

## Documentation Language Policy

- AI-facing and implementation-control information must be written in English.
- User-facing, presenter-facing, and audience-facing information must be written in Portuguese.
- Keep domain terms in English when they are product labels or finance concepts from the test, such as Invoice, Accounts Receivable, Accounts Payable, Statements, QuickBooks, Supabase, and App Router.
- Do not translate code identifiers, branch names, file paths, package names, or commands.

Current split:

- English for agents: `AGENTS.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/tasks.md`, `docs/skills.md`.
- Portuguese for humans/presentation: `docs/README.md`, `docs/pre-development.md`, `docs/requirements.md`, `docs/roadmap.md`, `docs/presentation-guide.md`, `docs/visual-direction.md`, `docs/ai-usage-log.md`, `docs/diagrams/README.md`, and diagram labels.

## Required Stack

- Next.js 14+ with App Router.
- React functional components and hooks.
- TypeScript.
- Supabase for database, auth, storage, and realtime when applicable.
- Tailwind CSS.
- Git and GitHub with meaningful Conventional Commits.

No full app scaffold belongs in this pre-development branch. Start implementation in feature branches.

## Skill Usage Rules

Project skills live in `.agents/skills` and are versioned with this repository. Prefer these project-local skills over global/user-level skills so future sessions use the same rules and references.

Use installed/researched skills when they match the task:

- `supabase`: Supabase clients, auth, SSR, storage, realtime, migrations, RLS, and platform decisions.
- `supabase-postgres-best-practices`: schema design, indexes, constraints, SQL review, and Postgres performance.
- `next-best-practices`: Next.js App Router, routing, Server Components, Client Components, caching, and data fetching.
- `vercel-react-best-practices`: React correctness, hooks, performance, memoization, and component behavior.
- `vercel-composition-patterns`: reusable component APIs, composition, slot patterns, and avoiding prop-heavy components.
- `web-design-guidelines`: UX, accessibility, layout quality, visual polish, and responsive review.
- `building-components`: accessible and reusable UI component design.
- `jewelry-erp-finance-domain`: domain-specific finance rules for jewelry ERP, realistic data, statuses, reports, AR/AP, statements, and QuickBooks context.
- `imagegen`: generated visual assets, diagram images, moodboards, and presentation graphics.

When a skill is unavailable or stale, document the fallback in the affected doc or PR summary.

## AI Usage Policy

- AI output must be reviewed and adapted before it becomes project code.
- Do not paste generated code that you cannot explain in the final presentation.
- Record important AI usage in `docs/ai-usage-log.md`.
- Never commit secrets, Supabase service role keys, private PDFs, or raw confidential test material.
- Keep style consistent; do not mix unrelated AI-generated patterns.

## Development Workflow

Use semantic branch names:

- `docs/pre-development`
- `feat/dashboard-financeiro`
- `feat/invoicing`
- `feat/payments-accounts`
- `feat/statements-reports`
- `feat/automations`
- `fix/<area>-<problema>`
- `chore/<tarefa>`
- `refactor/<area>`

Multiple commits are allowed per branch. Keep commits small and semantic:

- `docs: add pre-development structure`
- `docs: map technical test requirements`
- `docs: add architecture and data diagrams`
- `chore: register agent skill workflow`
- `feat: add dashboard financial KPIs`
- `test: cover invoice filtering`
- `fix: correct overdue balance calculation`

## Implementation Standards

- Map every feature to `docs/requirements.md`.
- Prefer small, composable components with clear responsibilities.
- Use `useMemo` and `useCallback` only when they prevent meaningful recalculation, unstable references, or child re-renders. Do not add them as decoration.
- Keep money formatting centralized and testable.
- Include loading, empty, error, hover, focus, and responsive states for user-facing views.
- Use realistic jewelry finance mock data until Supabase persistence is active.
- Treat QuickBooks, payments, email, PDF export, and gold price API as integration boundaries unless a feature explicitly implements them.

## Verification Before Commit

Before committing a branch:

- Run the relevant checks for that branch.
- Confirm no PDFs or secrets are staged.
- Confirm docs still match the implemented scope.
- Update `docs/ai-usage-log.md` when AI materially influenced a feature.
