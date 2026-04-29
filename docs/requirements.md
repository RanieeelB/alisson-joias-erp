# Requirements Map

## Evaluation Goal

The test evaluates more than coding speed. The project must show that AI was used strategically to analyze a jewelry ERP reference, produce a professional finance module, and maintain quality under a short delivery window.

## Mandatory Stack

- Next.js 14+ with App Router.
- React functional components and hooks.
- Supabase for database, authentication, and storage.
- Tailwind CSS.
- Git and GitHub with meaningful commit history.

## Etapa 1 - Dashboard Financeiro

Goal: provide the finance manager with a scan-friendly overview of revenue, open balances, aging, top customers, and recent activity.

Acceptance criteria:

- KPI cards for Receita Total, AR Outstanding, Faturas do mes, and Faturas em atraso.
- Revenue and profit chart for the last 6 months.
- Donut or pie chart for revenue by category: Custom Orders, Repairs, Wholesale, Retail.
- AR Aging Summary table: Current, 1-30d, 31-60d, 61-90d, 90+.
- Top 5 customers by open balance.
- Recent finance activity feed.
- Values use consistent money formatting and realistic jewelry finance data.

## Etapa 2 - Invoicing Completo

Goal: create the main invoice management experience.

Acceptance criteria:

- Invoice listing with status filters: All, Pending, Partial, Paid, Overdue.
- Search by invoice number or customer name.
- Summary cards: Total faturado, Coletado, Outstanding, Overdue.
- Table columns: Invoice #, Customer, Type, Date, Due Date, Total, Paid, Balance, Status, Actions.
- Invoice detail page with dark header, customer data, jewelry line items, subtotal, tax, total, paid, and balance.
- Side action panel: Send, Record Payment, Print, Download PDF, Edit.
- Payment history on the invoice detail.
- QuickBooks sync indicator.

## Etapa 3 - Payments and Accounts

Goal: cover payment tracking, Accounts Receivable, and Accounts Payable.

Payments acceptance criteria:

- Payment listing with Payment #, linked invoice, customer, date, amount, method, and reference.
- Cards for Collected This Month, Pending Deposits, and Overpayments/Credits.
- Button or flow to register a new payment.

Accounts Receivable acceptance criteria:

- Aging Analysis chart by date bucket.
- Customer balances with proportional progress bars.
- Open invoice list with reminder action.

Accounts Payable acceptance criteria:

- Vendor obligation table with AP #, Vendor, Category, Date, Due, Total, Paid, Balance, Status.
- Summary cards: Total Payable, Paid This Month, Overdue.
- Categories: Raw Materials, Components, Certification, Services.

## Etapa 4 - Statements and Reports

Goal: provide statement generation and finance analytics.

Statements acceptance criteria:

- Date range selector.
- Customer cards showing name, invoice count, balance, and View/Print/Email actions.
- Email All Statements action.
- Bulk Download action.

Reports acceptance criteria:

- Report type selector: Revenue Analysis, Cash Flow, Profit & Loss, Tax Summary.
- Revenue Analysis chart with revenue, expenses, profit, plus monthly table with margin and trend.
- Cash Flow line chart with inflows versus outflows.
- Profit & Loss statement with revenue, COGS, operating expenses, and net profit.
- Tax Summary quarterly cards with collected values and status.
- Export Report action.

## Etapa 5 - Bonus and Automations

Goal: demonstrate proactive automation, which is important to Alisson Joias.

Bonus candidates:

- Automatic invoice generation when a job order is finalized.
- Overdue invoice notifications with visual reminder logic.
- Automatic late fee/interest calculation.
- Supabase Realtime dashboard updates.
- Scheduled statement emails.
- Real Supabase CRUD persistence.
- Functional invoice creation form with validation.
- Workflow: order finalized -> invoice generated -> email sent -> payment registered.
- Scheduled PDF/CSV report export.
- External API integration, for example real-time gold price.

## Design and UX Requirements

- Jewelry domain palette: gold, black, cream, with restrained supporting colors.
- Professional hierarchy: display font for brand moments, readable body font, monospace for values where useful.
- Consistent spacing and no cramped UI.
- Visible hover, active, and focus states.
- Semantic status badges: green paid, yellow pending, blue partial, red overdue.
- Avoid generic template appearance.

