# Skills Research and Installation

## Project-Local Installed Skills

The following public skills were installed into this project through `npx skills add ... -y`. They live in `.agents/skills` and are tracked with `skills-lock.json` so future sessions can restore the same skill set. They were intentionally installed project-locally, not globally.

| Skill | Source | Purpose |
| --- | --- | --- |
| `supabase` | `supabase/agent-skills` | Supabase platform, Auth, SSR, RLS, storage, realtime, migrations |
| `supabase-postgres-best-practices` | `supabase/agent-skills` | Postgres schema quality, indexes, constraints, SQL review |
| `vercel-react-best-practices` | `vercel-labs/agent-skills` | React correctness, hooks, memoization, performance, component behavior |
| `next-best-practices` | `vercel-labs/next-skills` | Next.js App Router, Server Components, Client Components, caching |
| `vercel-composition-patterns` | `vercel-labs/agent-skills` | Component composition and API design |
| `web-design-guidelines` | `vercel-labs/agent-skills` | UI quality, accessibility, responsive layout, visual polish |
| `building-components` | `vercel/components.build` | Accessible and reusable component construction |

The first attempted source for `next-best-practices` under `vercel-labs/agent-skills` did not contain that skill. Search found the current package at `vercel-labs/next-skills`, which was installed instead.

The first attempted source for `building-components` under `vercel-labs/agent-skills` did not contain that skill. Search found the current package at `vercel/components.build`, which was installed instead.

## Custom Local Skill

Created local skill:

- `jewelry-erp-finance-domain`
- Location: `.agents/skills/jewelry-erp-finance-domain`
- Validation: `quick_validate.py` returned `Skill is valid!`

Use it when the work involves jewelry finance domain decisions, mock data, AR/AP, statements, QuickBooks context, status vocabulary, reports, or visual identity.

## Usage Policy

Use skills as guardrails, not as a substitute for understanding. The final app must be explainable in the presentation.

When using a skill during a branch, record the relevant usage in `docs/ai-usage-log.md` if it materially shaped code, schema, UX, or architecture.

Avoid relying on global/user-level skills for this project. If a useful skill is needed, install it project-locally and update this document.
