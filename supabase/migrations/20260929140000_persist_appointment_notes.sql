-- Keep customer observations and private admin notes across devices.
alter table public.appointments
  add column if not exists client_notes text,
  add column if not exists admin_note text;

-- Anonymous clients may submit an observation, but cannot set private notes.
drop policy if exists "appointments_public_insert" on public.appointments;
create policy "appointments_public_insert"
on public.appointments for insert to anon
with check (status = 'pendente' and admin_note is null);

-- Authenticated administrators insert through appointments_admin_all.
