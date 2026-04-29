# Skills Research and Installation

## Installed Skills

The following public skills were installed globally for this development environment through `npx skills add ... -g -y`:

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
- Location: `C:\Users\ranie\.agents\skills\jewelry-erp-finance-domain`
- Validation: `quick_validate.py` returned `Skill is valid!`

Use it when the work involves jewelry finance domain decisions, mock data, AR/AP, statements, QuickBooks context, status vocabulary, reports, or visual identity.

## Usage Policy

Use skills as guardrails, not as a substitute for understanding. The final app must be explainable in the presentation.

When using a skill during a branch, record the relevant usage in `docs/ai-usage-log.md` if it materially shaped code, schema, UX, or architecture.

