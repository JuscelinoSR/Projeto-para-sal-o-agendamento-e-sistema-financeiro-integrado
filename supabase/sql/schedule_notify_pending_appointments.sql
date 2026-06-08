-- Supabase SQL Editor
-- Agenda a Edge Function de notificação do admin para rodar a cada 5 minutos.
-- Requer as extensões pg_cron e pg_net habilitadas no projeto.

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Configure estes settings no banco antes de agendar:
-- ALTER DATABASE postgres SET app.settings.supabase_url = 'https://SEU-PROJETO.supabase.co';
-- ALTER DATABASE postgres SET app.settings.service_role_key = 'SUA_SERVICE_ROLE_KEY';

SELECT cron.unschedule('notify-pending-appointments-every-5-min')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'notify-pending-appointments-every-5-min'
);

SELECT cron.schedule(
  'notify-pending-appointments-every-5-min',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/notify-pending-appointments',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object('source', 'pg_cron')
  );
  $$
);