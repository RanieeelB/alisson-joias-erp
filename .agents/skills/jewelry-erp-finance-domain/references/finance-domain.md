# Finance Domain Reference

## Entities

- Customer: jewelry client, retailer, wholesaler, or repair customer.
- Vendor: supplier or service provider for raw materials, components, certification, or services.
- Invoice: billing document for job order, sales order, or repair.
- Invoice line item: jewelry-specific item, labor, material, gemstone, repair, certification, or service charge.
- Payment: wire, ACH, or credit card payment linked to invoice and customer.
- Accounts payable: obligation owed to a vendor.
- Statement: customer-facing summary of invoices, payments, credits, and balance for a date range.

## Example Customers

- Aurora & Co. Fine Jewelry
- Carvalho Atelier
- Northline Wholesale Jewelers
- Diamond Crest Retail
- Helena Martins Bridal

## Example Vendors

- GoldSource Refinery - Raw Materials
- GemCert Labs - Certification
- NovaStone Components - Components
- BrightBench Services - Services

## Example Line Items

- 18k yellow gold custom engagement ring
- Platinum prong repair and stone tightening
- Diamond melee replacement, G-H VS
- CAD design labor for custom pendant
- Casting service for wholesale batch
- GIA-style certification handling

## Calculations

- subtotal = sum(line_total)
- tax = taxable subtotal times tax rate
- total = subtotal + tax
- balance = total - paid
- overpayment/credit = max(paid - total, 0)
- aging bucket comes from due date versus current date: current, 1-30, 31-60, 61-90, 90+

## Visual Cues

- paid: green
- pending: amber/yellow
- partial: blue
- overdue: red
- credit/overpayment: teal or emerald
- synced: green check
- sync pending: amber clock
- sync failed: red warning

## Integration Boundaries

For the technical test, integrations can be represented as credible seams:

- QuickBooks: sync badge, sync history, queued push/pull actions.
- Payment gateway: record payment and simulated card payment state.
- Email: send invoice, send reminder, email all statements.
- PDF/CSV: export buttons and documented service boundary.
- Gold price API: optional bonus for pricing context, not required for core finance.
