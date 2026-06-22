-- Corrige exposicao publica de agendamentos, logs e RPCs internas.
-- Esta migration e independente e pode ser executada mesmo se a anterior ainda nao foi aplicada.

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

drop policy if exists "Owners can manage admin profiles" on public.admin_profiles;
create policy "Owners can manage admin profiles"
on public.admin_profiles
for all
to authenticated
using (public.is_current_owner())
with check (public.is_current_owner());

drop policy if exists "service_catalog_admin_all" on public.service_catalog;
create policy "service_catalog_admin_all"
on public.service_catalog for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "salon_professionals_admin_all" on public.salon_professionals;
create policy "salon_professionals_admin_all"
on public.salon_professionals for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "work_gallery_admin_all" on public.work_gallery_images;
create policy "work_gallery_admin_all"
on public.work_gallery_images for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "financial_transactions_admin_all" on public.financial_transactions;
create policy "financial_transactions_admin_all"
on public.financial_transactions for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update"
on public.site_settings for update to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "site_settings_admin_insert" on public.site_settings;
create policy "site_settings_admin_insert"
on public.site_settings for insert to authenticated
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

alter table public.appointments enable row level security;
alter table public.whatsapp_notification_logs enable row level security;

drop policy if exists "appointments_public_insert" on public.appointments;
create policy "appointments_public_insert"
on public.appointments
for insert
to anon, authenticated
with check (status = 'pendente');

drop policy if exists "appointments_admin_all" on public.appointments;
create policy "appointments_admin_all"
on public.appointments
for all
to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "whatsapp_logs_admin_read" on public.whatsapp_notification_logs;
create policy "whatsapp_logs_admin_read"
on public.whatsapp_notification_logs
for select
to authenticated
using (public.is_current_admin());

-- Estas RPCs sao internas da Edge Function e nunca devem ficar abertas ao navegador.
revoke all on function public.get_pending_admin_notifications(integer) from public, anon, authenticated;
revoke all on function public.register_admin_notification_attempt(
  uuid, text, text, boolean, integer, text, text
) from public, anon, authenticated;

grant execute on function public.get_pending_admin_notifications(integer) to service_role;
grant execute on function public.register_admin_notification_attempt(
  uuid, text, text, boolean, integer, text, text
) to service_role;
