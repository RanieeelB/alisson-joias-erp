-- Supabase Storage: private bucket for finance PDF exports
-- Policies restrict access to authenticated internal finance users.

insert into storage.buckets (id, name, public)
values ('finance-exports', 'finance-exports', false)
on conflict (id) do nothing;

-- Allow internal finance users to read exported files
create policy "finance_exports_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'finance-exports'
  and (select public.is_internal_finance_user())
);

-- Allow internal finance users to upload exported files
create policy "finance_exports_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'finance-exports'
  and (select public.is_internal_finance_user())
);

-- Allow internal finance users to overwrite exported files
create policy "finance_exports_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'finance-exports'
  and (select public.is_internal_finance_user())
);

-- Allow internal finance users to delete exported files
create policy "finance_exports_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'finance-exports'
  and (select public.is_internal_finance_user())
);
