-- Cria um agendamento pendente para testar a Edge Function notify-pending-appointments.
-- Rode depois da migration 20260608120000_create_appointments_notifications.sql.

insert into appointments (
  client_name,
  service,
  professional,
  appointment_date,
  appointment_time,
  client_phone,
  value,
  status
) values (
  'Cliente Teste',
  'Escova modelada',
  'Ana Souza',
  current_date + interval '1 day',
  '10:30',
  '5564999999999',
  120.00,
  'pendente'
) returning
  id,
  client_name,
  service,
  professional,
  appointment_date,
  appointment_time,
  status,
  notification_count;
