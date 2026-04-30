# Payments and Accounts Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Step 3 of the finance module with protected Payments, Accounts Receivable, and Accounts Payable workspaces based on the approved visual prototype.

**Architecture:** Add a focused `payments-accounts` feature with local types, realistic jewelry finance mock data, pure summary/filter helpers, and reusable server-rendered UI blocks. Expose three protected App Router pages: `/payments`, `/accounts/receivable`, and `/accounts/payable`, all using the shared finance shell and existing Supabase auth guard pattern.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript, Tailwind CSS v4, Supabase SSR auth helpers, Node test runner.

---

## Chunk 1: Data Contracts And Routes

### Task 1: Add failing data/helper tests

**Files:**
- Create: `tests/payments-accounts.test.mjs`
- Create later: `src/features/payments-accounts/types.ts`
- Create later: `src/features/payments-accounts/data.ts`

- [ ] **Step 1: Write the failing test**

Cover:
- Payment list summaries: collected this month, pending deposits, credits.
- AR aging buckets and customer balance bars.
- AP summaries: total payable, paid this month, overdue.
- Page/source structure for `/payments`, `/accounts/receivable`, `/accounts/payable`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/payments-accounts.test.mjs`
Expected: FAIL because `src/features/payments-accounts/data.ts` does not exist.

### Task 2: Implement data, helpers, and protected routes

**Files:**
- Create: `src/features/payments-accounts/types.ts`
- Create: `src/features/payments-accounts/data.ts`
- Create: `src/app/payments/page.tsx`
- Create: `src/app/accounts/receivable/page.tsx`
- Create: `src/app/accounts/payable/page.tsx`

- [ ] **Step 1: Add types and realistic mock data**

Include payments, open invoices for AR, customer balances, and AP obligations with jewelry-specific vendors/categories.

- [ ] **Step 2: Add summary/filter helpers**

Keep calculations pure and testable. Use integer cents and existing money formatter in UI only.

- [ ] **Step 3: Add protected route files**

Follow the existing invoices/dashboard auth pattern with `createClient`, `auth.getUser`, role checks for `admin`/`staff`, and redirects to `/login?erro=acesso`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/payments-accounts.test.mjs`
Expected: PASS.

## Chunk 2: UI Implementation

### Task 3: Build Step 3 workspaces

**Files:**
- Create: `src/features/payments-accounts/components/payments-page.tsx`
- Create: `src/features/payments-accounts/components/accounts-receivable-page.tsx`
- Create: `src/features/payments-accounts/components/accounts-payable-page.tsx`
- Modify: `src/features/finance-shell/components/finance-shell.tsx`

- [ ] **Step 1: Build Payments page**

Add KPI cards, filters, required payment columns, overpayment/credit signal, and `Registrar pagamento` action.

- [ ] **Step 2: Build Accounts Receivable page**

Add Aging Analysis bars, customer balance bars, open invoice reminder list, and reminder actions.

- [ ] **Step 3: Build Accounts Payable page**

Add AP summary cards and table with AP #, Vendor, Category, Date, Due, Total, Paid, Balance, Status.

- [ ] **Step 4: Update shell navigation**

Point `Pagamentos`, `Contas a Receber`, and `Contas a Pagar` at the new routes.

- [ ] **Step 5: Verify tests**

Run: `npm test -- tests/payments-accounts.test.mjs`
Expected: PASS.

## Chunk 3: Documentation, Verification, Commits

### Task 4: Update project docs and verify

**Files:**
- Modify: `docs/tasks.md`
- Modify: `docs/ai-usage-log.md`

- [ ] **Step 1: Mark completed Step 3 tasks that are implemented**

Update only boxes truly delivered in this branch.

- [ ] **Step 2: Add AI usage log entry**

Record skills, accepted output, human approval of prototype, and follow-ups.

- [ ] **Step 3: Run verification**

Run:
- `npm test`
- `npm run lint`
- `npm run build`
- staged file check for PDFs/secrets

- [ ] **Step 4: Commit in small semantic chunks**

Suggested commits:
- `test: cover payments accounts data`
- `feat: add payments accounts workspaces`
- `docs: update payments accounts progress`
