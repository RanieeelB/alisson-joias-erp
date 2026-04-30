# Task Backlog

## Pre-Development

- [x] Create semantic branch `docs/pre-development`.
- [x] Research and install useful public skills.
- [x] Create local domain skill `jewelry-erp-finance-domain`.
- [x] Add `AGENTS.md`.
- [x] Add documentation structure.
- [x] Generate simple Portuguese diagram images.
- [x] Validate documentation and git state.
- [x] Commit pre-development work.

## Step 1 - Financial Dashboard

- [x] Scaffold the Next.js 14+ App Router project with TypeScript and Tailwind.
- [x] Configure base theme, layout, navigation, and finance shell.
- [x] Create realistic jewelry finance mock data.
- [x] Build KPI cards.
- [x] Build revenue/profit chart.
- [x] Build revenue by category donut chart.
- [x] Build AR aging summary table.
- [x] Build top customers list.
- [x] Build recent activity feed.
- [x] Add responsive, hover, focus, loading, and empty states.

## Step 2 - Complete Invoicing

- [x] Define initial Supabase invoice and invoice line item schema.
- [x] Configure Supabase auth locally without email confirmation.
- [x] Add RLS policies for internal finance users and customer ownership.
- [x] Connect the Next.js app to Supabase with SSR clients and request proxy.
- [x] Prototype and implement internal Supabase Auth login screen.
- [x] Protect the dashboard route for authenticated `admin`/`staff` users.
- [x] Define invoice and invoice line item TypeScript types for UI/data queries.
- [x] Build invoice status filters.
- [x] Build invoice search by number/customer.
- [x] Build invoice summary cards.
- [x] Build invoice table with required columns.
- [ ] Build invoice detail route.
- [ ] Build jewelry line item display and calculations.
- [ ] Build invoice action side panel.
- [ ] Build payment history block.
- [x] Build QuickBooks sync indicator.

## Step 3 - Payments and Accounts

- [ ] Define payment model and methods.
- [ ] Build payment list.
- [ ] Build payment summary cards.
- [ ] Build register payment flow.
- [ ] Build AR aging analysis chart.
- [ ] Build customer balance bars.
- [ ] Build open invoice reminder list.
- [ ] Define vendor/AP model.
- [ ] Build AP table and summary cards.

## Step 4 - Statements and Reports

- [ ] Build statement date range selector.
- [ ] Build customer statement cards.
- [ ] Build View/Print/Email statement actions.
- [ ] Build Email All Statements action.
- [ ] Build Bulk Download action.
- [ ] Build report type selector.
- [ ] Build Revenue Analysis view.
- [ ] Build Cash Flow view.
- [ ] Build Profit & Loss view.
- [ ] Build Tax Summary view.
- [ ] Build Export Report action.

## Step 5 - Bonus and Automations

- [ ] Choose bonus features based on remaining time.
- [ ] Add automatic invoice generation from finalized order.
- [ ] Add overdue reminders.
- [ ] Add late fee calculation.
- [ ] Add Supabase Realtime updates.
- [ ] Add scheduled statement email concept.
- [ ] Add PDF/CSV export concept.
- [ ] Add gold price API concept if useful.
