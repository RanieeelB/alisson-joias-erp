# Statements and Reports Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Step 4 `/statements` and `/reports` finance workspaces from the approved prototype.

**Architecture:** Add a focused `statements-reports` feature with mock domain data, pure summary helpers, and two protected App Router pages. Reuse the existing `FinanceShell`, money formatting, server auth flow, and Tailwind visual language.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS, Supabase SSR auth, Node test runner.

---

## Chunk 1: Data and Tests

**Files:**
- Create: `src/features/statements-reports/types.ts`
- Create: `src/features/statements-reports/data.ts`
- Create: `tests/statements-reports.test.mjs`

- [ ] **Step 1: Write failing tests for statements and reports data**

Cover statement summaries, report metrics, monthly revenue rows, cash flow totals, P&L totals, and tax summary totals.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/statements-reports.test.mjs`

Expected: fails because the feature data module does not exist yet.

- [ ] **Step 3: Implement focused mock data and pure helpers**

Use realistic jewelry customers, invoices, payments, expenses, tax quarters, and report type labels. Keep helpers deterministic and export the values needed by the UI.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `node --test tests/statements-reports.test.mjs`

Expected: all statements/reports tests pass.

## Chunk 2: Routes and UI

**Files:**
- Create: `src/app/statements/page.tsx`
- Create: `src/app/reports/page.tsx`
- Create: `src/features/statements-reports/components/statements-page.tsx`
- Create: `src/features/statements-reports/components/reports-page.tsx`
- Modify: `src/features/finance-shell/components/finance-shell.tsx`
- Modify: `tests/statements-reports.test.mjs`

- [ ] **Step 1: Add failing route/UI tests**

Assert `/statements` and `/reports` routes use Supabase auth, `isInternalFinanceUser`, and the page components include the required acceptance labels.

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/statements-reports.test.mjs`

Expected: fails because routes/components are missing.

- [ ] **Step 3: Implement protected routes and page components**

Use the existing route protection pattern, compact controls, statement cards with View/Print/Email actions, bulk actions, report type selector, Revenue Analysis chart/table, Cash Flow, Profit & Loss, and Tax Summary summaries.

- [ ] **Step 4: Update shell navigation**

Point sidebar `Extratos` to `/statements` and `Relatórios` to `/reports`.

- [ ] **Step 5: Run tests to verify GREEN**

Run: `node --test tests/statements-reports.test.mjs`

Expected: all statements/reports tests pass.

## Chunk 3: Docs, Verification, Commit

**Files:**
- Modify: `docs/tasks.md`
- Modify: `docs/ai-usage-log.md`

- [ ] **Step 1: Mark Step 4 tasks complete**

Update `docs/tasks.md` after implementation matches acceptance criteria.

- [ ] **Step 2: Record AI usage**

Update `docs/ai-usage-log.md` with implementation details, tests, and remaining risks.

- [ ] **Step 3: Run full verification**

Run: `npm test`, `npm run lint`, and `npm run build`.

- [ ] **Step 4: Commit**

Commit with a short semantic message after confirming no secrets or PDFs are staged.
