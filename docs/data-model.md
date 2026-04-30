# Data Model

## Core Entities

### Customer

Stores jewelry customers.

Fields:

- `customer_id`
- `name`
- `email`
- `phone`
- optional billing address fields

Relationships:

- One customer has many invoices.
- One customer has many payments.
- One customer can have many statements.

### Vendor

Stores suppliers and service providers.

Fields:

- `vendor_id`
- `name`
- `category`
- optional contact fields

Relationships:

- One vendor has many accounts payable records.

### Invoice

Stores billing documents.

Fields:

- `invoice_id`
- `invoice_number`
- `order_type`: job_order, sales_order, repair
- `customer_id`
- `date`
- `due_date`
- `subtotal`
- `tax`
- `total`
- `paid`
- `balance`
- `status`
- `quickbooks_sync_status`

Relationships:

- One invoice belongs to one customer.
- One invoice has many line items.
- One invoice has many payments.

### Invoice Line Item

Stores invoice detail rows.

Fields:

- `item_id`
- `invoice_id`
- `description`
- `quantity`
- `unit_price`
- `tax`
- `line_total`

Use jewelry-specific descriptions, such as custom ring labor, gemstone replacement, casting, certification, or wholesale batch work.

### Payment

Stores money received.

Fields:

- `payment_id`
- `payment_number`
- `invoice_id`
- `customer_id`
- `date`
- `amount`
- `method`: wire, ach, credit_card
- `reference`

Supports partial payments and overpayments.

### Accounts Payable

Stores vendor obligations.

Fields:

- `ap_id`
- `vendor_id`
- `category`: raw_materials, components, certification, services
- `date`
- `due_date`
- `total`
- `paid`
- `balance`
- `status`

## Status Vocabulary

Invoice status:

- pending
- partial
- paid
- overdue

Accounts payable status:

- pending
- partial
- paid
- overdue

QuickBooks sync status:

- synced
- pending
- failed
- not_synced

## Calculation Rules

- `subtotal` comes from the sum of line totals.
- `tax` should be calculated or stored consistently.
- `total = subtotal + tax`.
- `balance = total - paid`.
- `overpayment = max(paid - total, 0)`.
- Aging buckets derive from due date and current date.

## Supabase Notes

Use numeric or integer cents for money to avoid floating point drift. If using Postgres `numeric`, centralize parsing and formatting in application helpers.

Add indexes for frequent filters:

- invoice status
- invoice due date
- invoice customer
- payment customer/date
- accounts payable vendor/status/due date

The initial Supabase migration lives in `supabase/migrations/20260430120000_init_finance_schema.sql` and creates:

- `profiles`
- `customers`
- `vendors`
- `invoices`
- `invoice_line_items`
- `payments`
- `accounts_payable`
- `financial_activities`

Money values are stored as integer cents. RLS is enabled on every public table. Internal finance access is granted through `app_metadata.role` values of `admin` or `staff`; customer-facing reads are scoped through `customers.auth_user_id`.
