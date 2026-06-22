-- Centraliza a autorização admin, elimina recursão de RLS e protege a agenda.

create or replace function public.is_current_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  );
$$;

create or replace function public.is_current_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.role = 'owner'
      and ap.active = true
  );
$$;

revoke all on function public.is_current_admin() from public;
revoke all on function public.is_current_owner() from public;
grant execute on function public.is_current_admin() to anon, authenticated;
grant execute on function public.is_current_owner() to authenticated;

drop policy if exists "Owners can manage admin profiles" on admin_profiles;
create policy "Owners can manage admin profiles"
on admin_profiles
for all
to authenticated
using (public.is_current_owner())
with check (public.is_current_owner());

drop policy if exists "service_catalog_admin_all" on service_catalog;
create policy "service_catalog_admin_all"
on service_catalog for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "salon_professionals_admin_all" on salon_professionals;
create policy "salon_professionals_admin_all"
on salon_professionals for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "work_gallery_admin_all" on work_gallery_images;
create policy "work_gallery_admin_all"
on work_gallery_images for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "financial_transactions_admin_all" on financial_transactions;
create policy "financial_transactions_admin_all"
on financial_transactions for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "site_settings_admin_update" on site_settings;
create policy "site_settings_admin_update"
on site_settings for update to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "site_settings_admin_insert" on site_settings;
create policy "site_settings_admin_insert"
on site_settings for insert to authenticated
with check (id = 'default' and public.is_current_admin());

drop policy if exists "site_assets_admin_write" on storage.objects;
create policy "site_assets_admin_write"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets' and public.is_current_admin());

drop policy if exists "site_assets_admin_update" on storage.objects;
create policy "site_assets_admin_update"
on storage.objects for update to authenticated
using (bucket_id = 'site-assets' and public.is_current_admin())
with check (bucket_id = 'site-assets' and public.is_current_admin());

alter table appointments enable row level security;

drop policy if exists "appointments_public_insert" on appointments;
create policy "appointments_public_insert"
on appointments
for insert
to anon, authenticated
with check (status = 'pendente');

drop policy if exists "appointments_admin_all" on appointments;
create policy "appointments_admin_all"
on appointments
for all
to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());
