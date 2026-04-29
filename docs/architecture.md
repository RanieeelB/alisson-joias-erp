# Architecture

## Overview

The planned app is a Next.js 14+ App Router application backed by Supabase. The first implementation can start with realistic mock data, then progressively replace mock sources with Supabase tables, auth, storage, and realtime subscriptions.

The architecture should make integrations visible without overbuilding them. QuickBooks, payment processing, email, PDF/CSV export, and gold price APIs can begin as service boundaries and simulated actions.

## Frontend

Use App Router route groups for finance areas:

- `/dashboard`
- `/invoices`
- `/invoices/[id]`
- `/payments`
- `/accounts/receivable`
- `/accounts/payable`
- `/statements`
- `/reports`

Prefer Server Components for initial data loading and Client Components for filters, charts, forms, tabs, dialogs, and interactive actions.

## Data Access

Use Supabase with SSR-compatible clients. Keep server-only environment variables on the server and expose only the anon key where appropriate.

Planned layers:

- `lib/supabase/server.ts` for server client.
- `lib/supabase/client.ts` for browser client.
- `features/<feature>/data/` for feature-specific queries.
- `features/<feature>/components/` for UI.
- `features/<feature>/types.ts` for feature-local types when needed.

Exact file paths will be finalized when the Next.js scaffold exists.

## Authentication and Authorization

Plan roles early even if the first demo uses a single internal user:

- `admin`: full finance access.
- `staff`: internal operational access.
- `customer`: portal access to own invoices/statements.

Supabase RLS should enforce ownership for customer-facing data and internal role checks for admin/staff workflows.

## Integration Boundaries

- QuickBooks bridge: sync invoice/payment state, expose status and errors.
- Payment gateway: accept card payments or simulate card payment registration.
- Email service: send invoice, reminders, and statements.
- Storage: save generated PDFs or exports.
- Gold price API: optional bonus service for pricing context.

Do not put third-party secrets in client code.

## Realtime

Supabase Realtime is a strong bonus for dashboard metrics and invoice/payment activity. Use it selectively after core CRUD and state calculations are stable.

## Diagram Sources

Editable diagram sources live in `docs/diagrams/`. Presentation-style images live in `docs/assets/diagrams/`.

