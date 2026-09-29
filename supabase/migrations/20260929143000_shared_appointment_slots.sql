-- Public availability exposes times only, never customer details.
create or replace function public.booked_appointment_times(
  requested_date date,
  requested_professional text
)
returns table (slot_time time)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct a.appointment_time
  from public.appointments a
  where a.appointment_date = requested_date
    and a.professional = requested_professional
    and a.status in ('pendente', 'aprovado', 'reagendado', 'concluido');
$$;

revoke all on function public.booked_appointment_times(date, text) from public;
grant execute on function public.booked_appointment_times(date, text) to anon, authenticated;

create index if not exists idx_appointments_professional_date_time
  on public.appointments (professional, appointment_date, appointment_time)
  where status in ('pendente', 'aprovado', 'reagendado', 'concluido');

-- A lock makes two simultaneous requests for the same slot serialize.
-- Existing duplicate rows are preserved; new conflicts are rejected.
create or replace function public.prevent_appointment_slot_conflict()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('pendente', 'aprovado', 'reagendado', 'concluido') then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        new.professional || ':' || new.appointment_date::text || ':' || new.appointment_time::text,
        0
      )
    );
    if exists (
      select 1 from public.appointments a
      where a.professional = new.professional
        and a.appointment_date = new.appointment_date
        and a.appointment_time = new.appointment_time
        and a.status in ('pendente', 'aprovado', 'reagendado', 'concluido')
        and a.id is distinct from new.id
    ) then
      raise exception 'Horário já ocupado para esta profissional.' using errcode = '23505';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_appointment_slot_conflict on public.appointments;
create trigger trg_prevent_appointment_slot_conflict
before insert or update of professional, appointment_date, appointment_time, status
on public.appointments
for each row execute function public.prevent_appointment_slot_conflict();
