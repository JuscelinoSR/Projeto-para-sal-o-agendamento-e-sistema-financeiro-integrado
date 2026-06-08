-- BeautyJSR / Salão Larissa
-- Sistema de notificação WhatsApp para admin sobre agendamentos pendentes.

create extension if not exists pgcrypto;

-- Status do agendamento
DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM (
    'pendente', 'aprovado', 'recusado',
    'cancelado', 'reagendado', 'concluido', 'faltou'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tabela principal
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  service TEXT NOT NULL,
  professional TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  client_phone TEXT NOT NULL,
  value NUMERIC(10,2) NOT NULL,

  -- Campos de status e notificação
  status appointment_status DEFAULT 'pendente' NOT NULL,
  notification_count INTEGER DEFAULT 0 NOT NULL,
  last_notification_sent_at TIMESTAMPTZ,
  admin_notified_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Compatibilidade caso a tabela já exista sem todos os campos.
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS status appointment_status DEFAULT 'pendente' NOT NULL;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notification_count INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS last_notification_sent_at TIMESTAMPTZ;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS admin_notified_at TIMESTAMPTZ;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- Log de notificações enviadas ou com erro.
CREATE TABLE IF NOT EXISTS whatsapp_notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  admin_phone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  attempt_number INTEGER NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_last_notification ON appointments(last_notification_sent_at);
CREATE INDEX IF NOT EXISTS idx_appointments_pending_notifications
  ON appointments(status, notification_count, last_notification_sent_at)
  WHERE status = 'pendente' AND notification_count < 6;
CREATE INDEX IF NOT EXISTS idx_whatsapp_notification_logs_appointment
  ON whatsapp_notification_logs(appointment_id, created_at DESC);

-- Atualiza updated_at automaticamente.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_appointments_set_updated_at ON appointments;
CREATE TRIGGER trg_appointments_set_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Seleciona agendamentos pendentes que devem ser notificados.
CREATE OR REPLACE FUNCTION get_pending_admin_notifications(batch_limit INTEGER DEFAULT 20)
RETURNS SETOF appointments
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM appointments
  WHERE status = 'pendente'
    AND notification_count < 6
    AND (
      last_notification_sent_at IS NULL
      OR last_notification_sent_at <= NOW() - INTERVAL '5 minutes'
    )
  ORDER BY created_at ASC
  LIMIT batch_limit;
$$;

-- Registra tentativa e incrementa contador somente quando a função chamar este RPC.
CREATE OR REPLACE FUNCTION register_admin_notification_attempt(
  appointment_uuid UUID,
  provider_name TEXT,
  admin_phone_number TEXT,
  was_sent BOOLEAN,
  http_status INTEGER DEFAULT NULL,
  http_body TEXT DEFAULT NULL,
  error_text TEXT DEFAULT NULL
)
RETURNS appointments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_appointment appointments;
  next_attempt INTEGER;
BEGIN
  SELECT notification_count + 1
  INTO next_attempt
  FROM appointments
  WHERE id = appointment_uuid;

  INSERT INTO whatsapp_notification_logs (
    appointment_id,
    provider,
    admin_phone,
    status,
    attempt_number,
    response_status,
    response_body,
    error_message
  ) VALUES (
    appointment_uuid,
    provider_name,
    admin_phone_number,
    CASE WHEN was_sent THEN 'sent' ELSE 'failed' END,
    COALESCE(next_attempt, 1),
    http_status,
    http_body,
    error_text
  );

  UPDATE appointments
  SET
    notification_count = notification_count + 1,
    last_notification_sent_at = NOW(),
    admin_notified_at = COALESCE(admin_notified_at, NOW())
  WHERE id = appointment_uuid
    AND status = 'pendente'
    AND notification_count < 6
  RETURNING * INTO updated_appointment;

  RETURN updated_appointment;
END;
$$;