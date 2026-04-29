---
name: jewelry-erp-finance-domain
description: Use when planning, implementing, reviewing, or documenting finance features for the Alisson Joias jewelry ERP technical test, including invoices, payments, AR/AP, statements, reports, jewelry-specific mock data, QuickBooks context, and visual identity.
---

# Jewelry ERP Finance Domain

## Overview

Use this skill to keep the project grounded in the Alisson Joias technical test and in jewelry ERP finance workflows. Treat the test PDF as the source of truth and use this skill to preserve domain language, realistic data, and finance behavior while working with Next.js, Supabase, React, and design skills.

## Required Context

Before making domain decisions, read the project docs in this order:

1. `AGENTS.md`
2. `docs/pre-development.md`
3. `docs/requirements.md`
4. `docs/data-model.md`
5. `docs/architecture.md`

If implementation details conflict, follow the test requirements first, then `AGENTS.md`, then the docs.

## Domain Rules

- Model the module as a jewelry ERP finance area, not a generic SaaS dashboard.
- Use realistic jewelry terms: custom orders, repairs, wholesale, retail, gold, platinum, diamonds, gemstones, casting, certification, raw materials, components, services.
- Keep finance labels aligned with the test: Dashboard, Invoicing, Payments, Accounts Receivable, Accounts Payable, Statements, Reports, QuickBooks sync.
- Treat QuickBooks, payment gateway, customer portal, email sending, PDF generation, and gold price API as integration boundaries unless the active feature explicitly implements them.
- Preserve status vocabulary: pending, partial, paid, overdue, credit, synced, sync pending, sync failed.
- Prefer USD examples when reproducing the PIRO reference, but keep formatting helpers flexible enough for other currencies.

## Feature Checklist

When creating or reviewing a feature, verify:

- It maps to a specific requirement in `docs/requirements.md`.
- It has realistic jewelry finance mock data if persistence is not active yet.
- It exposes loading, empty, error, hover, focus, and responsive states where applicable.
- It avoids fake destructive behavior; simulated actions should be visibly marked as mock or queued.
- It keeps calculations explainable: subtotal, tax, total, paid, balance, aging bucket, margin, profit.
- It does not introduce secrets, private PDFs, copied templates, or unreviewed AI output.

## Data Guidance

Use the reference file when designing schemas, seeds, examples, or reports:

- `references/finance-domain.md`

