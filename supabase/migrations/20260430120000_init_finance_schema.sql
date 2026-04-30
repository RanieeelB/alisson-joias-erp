create extension if not exists pgcrypto with schema extensions;

create function public.current_app_role()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'customer');
$$;

create function public.is_internal_finance_user()
returns boolean
language sql
stable
set search_path = ''
as $$
  select public.current_app_role() in ('admin', 'staff');
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('admin', 'staff', 'customer'))
);

create table public.customers (
  id uuid primary key default extensions.gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  segment text not null default 'retail',
  billing_street text,
  billing_city text,
  billing_region text,
  billing_postal_code text,
  billing_country text not null default 'BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  category text not null,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendors_category_check check (
    category in ('raw_materials', 'components', 'certification', 'services')
  )
);

create table public.invoices (
  id uuid primary key default extensions.gen_random_uuid(),
  invoice_number text not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  order_type text not null,
  invoice_date date not null,
  due_date date not null,
  subtotal_cents bigint not null default 0,
  tax_cents bigint not null default 0,
  total_cents bigint not null default 0,
  paid_cents bigint not null default 0,
  balance_cents bigint not null default 0,
  status text not null default 'pending',
  quickbooks_sync_status text not null default 'not_synced',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_order_type_check check (
    order_type in ('custom_order', 'repair', 'wholesale', 'retail')
  ),
  constraint invoices_amounts_non_negative_check check (
    subtotal_cents >= 0
    and tax_cents >= 0
    and total_cents >= 0
    and paid_cents >= 0
    and balance_cents >= 0
  ),
  constraint invoices_total_matches_components_check check (
    total_cents = subtotal_cents + tax_cents
  ),
  constraint invoices_status_check check (
    status in ('pending', 'partial', 'paid', 'overdue')
  ),
  constraint invoices_quickbooks_sync_status_check check (
    quickbooks_sync_status in ('synced', 'pending', 'failed', 'not_synced')
  )
);

create table public.invoice_line_items (
  id uuid primary key default extensions.gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  category text not null default 'service',
  quantity numeric(12, 2) not null default 1,
  unit_price_cents bigint not null default 0,
  tax_cents bigint not null default 0,
  line_total_cents bigint not null default 0,
  created_at timestamptz not null default now(),
  constraint invoice_line_items_quantity_positive_check check (quantity > 0),
  constraint invoice_line_items_amounts_non_negative_check check (
    unit_price_cents >= 0
    and tax_cents >= 0
    and line_total_cents >= 0
  )
);

create table public.payments (
  id uuid primary key default extensions.gen_random_uuid(),
  payment_number text not null unique,
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  payment_date date not null,
  amount_cents bigint not null,
  method text not null,
  reference text,
  created_at timestamptz not null default now(),
  constraint payments_amount_positive_check check (amount_cents > 0),
  constraint payments_method_check check (
    method in ('wire', 'ach', 'credit_card', 'cash', 'check')
  )
);

create table public.accounts_payable (
  id uuid primary key default extensions.gen_random_uuid(),
  ap_number text not null unique,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  category text not null,
  payable_date date not null,
  due_date date not null,
  total_cents bigint not null default 0,
  paid_cents bigint not null default 0,
  balance_cents bigint not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounts_payable_category_check check (
    category in ('raw_materials', 'components', 'certification', 'services')
  ),
  constraint accounts_payable_amounts_non_negative_check check (
    total_cents >= 0
    and paid_cents >= 0
    and balance_cents >= 0
  ),
  constraint accounts_payable_status_check check (
    status in ('pending', 'partial', 'paid', 'overdue')
  )
);

create table public.financial_activities (
  id uuid primary key default extensions.gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  title text not null,
  detail text not null,
  amount_cents bigint not null default 0,
  tone text not null default 'info',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint financial_activities_tone_check check (
    tone in ('success', 'warning', 'info', 'danger')
  )
);

create index customers_auth_user_id_idx on public.customers(auth_user_id);
create index customers_email_idx on public.customers(email);
create index invoices_customer_id_idx on public.invoices(customer_id);
create index invoices_status_idx on public.invoices(status);
create index invoices_due_date_idx on public.invoices(due_date);
create index invoices_customer_status_due_date_idx
  on public.invoices(customer_id, status, due_date);
create index invoice_line_items_invoice_id_idx
  on public.invoice_line_items(invoice_id);
create index payments_invoice_id_idx on public.payments(invoice_id);
create index payments_customer_id_idx on public.payments(customer_id);
create index payments_customer_date_idx
  on public.payments(customer_id, payment_date desc);
create index accounts_payable_vendor_id_idx
  on public.accounts_payable(vendor_id);
create index accounts_payable_status_idx on public.accounts_payable(status);
create index accounts_payable_due_date_idx on public.accounts_payable(due_date);
create index accounts_payable_vendor_status_due_date_idx
  on public.accounts_payable(vendor_id, status, due_date);
create index financial_activities_customer_occurred_at_idx
  on public.financial_activities(customer_id, occurred_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger vendors_set_updated_at
before update on public.vendors
for each row execute function public.set_updated_at();

create trigger invoices_set_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create trigger accounts_payable_set_updated_at
before update on public.accounts_payable
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.vendors enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_line_items enable row level security;
alter table public.payments enable row level security;
alter table public.accounts_payable enable row level security;
alter table public.financial_activities enable row level security;

grant usage on schema public to authenticated;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_internal_finance_user() to authenticated;
grant select, insert, update, delete on
  public.profiles,
  public.customers,
  public.vendors,
  public.invoices,
  public.invoice_line_items,
  public.payments,
  public.accounts_payable,
  public.financial_activities
to authenticated;

create policy profiles_select_own_or_internal
on public.profiles
for select
to authenticated
using (
  (select public.is_internal_finance_user())
  or id = (select auth.uid())
);

create policy profiles_insert_own_customer
on public.profiles
for insert
to authenticated
with check (
  id = (select auth.uid())
  and role = 'customer'
);

create policy profiles_update_own_or_internal
on public.profiles
for update
to authenticated
using (
  (select public.is_internal_finance_user())
  or id = (select auth.uid())
)
with check (
  (select public.is_internal_finance_user())
  or (
    id = (select auth.uid())
    and role = 'customer'
  )
);

create policy customers_internal_access
on public.customers
for all
to authenticated
using ((select public.is_internal_finance_user()))
with check ((select public.is_internal_finance_user()));

create policy customers_select_own_record
on public.customers
for select
to authenticated
using (auth_user_id = (select auth.uid()));

create policy vendors_internal_access
on public.vendors
for all
to authenticated
using ((select public.is_internal_finance_user()))
with check ((select public.is_internal_finance_user()));

create policy invoices_internal_access
on public.invoices
for all
to authenticated
using ((select public.is_internal_finance_user()))
with check ((select public.is_internal_finance_user()));

create policy invoices_select_own_customer
on public.invoices
for select
to authenticated
using (
  exists (
    select 1
    from public.customers
    where customers.id = invoices.customer_id
      and customers.auth_user_id = (select auth.uid())
  )
);

create policy invoice_line_items_internal_access
on public.invoice_line_items
for all
to authenticated
using ((select public.is_internal_finance_user()))
with check ((select public.is_internal_finance_user()));

create policy invoice_line_items_select_own_customer
on public.invoice_line_items
for select
to authenticated
using (
  exists (
    select 1
    from public.invoices
    join public.customers on customers.id = invoices.customer_id
    where invoices.id = invoice_line_items.invoice_id
      and customers.auth_user_id = (select auth.uid())
  )
);

create policy payments_internal_access
on public.payments
for all
to authenticated
using ((select public.is_internal_finance_user()))
with check ((select public.is_internal_finance_user()));

create policy payments_select_own_customer
on public.payments
for select
to authenticated
using (
  exists (
    select 1
    from public.customers
    where customers.id = payments.customer_id
      and customers.auth_user_id = (select auth.uid())
  )
);

create policy accounts_payable_internal_access
on public.accounts_payable
for all
to authenticated
using ((select public.is_internal_finance_user()))
with check ((select public.is_internal_finance_user()));

create policy financial_activities_internal_access
on public.financial_activities
for all
to authenticated
using ((select public.is_internal_finance_user()))
with check ((select public.is_internal_finance_user()));

create policy financial_activities_select_own_customer
on public.financial_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.customers
    where customers.id = financial_activities.customer_id
      and customers.auth_user_id = (select auth.uid())
  )
);
