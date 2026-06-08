# Notificação WhatsApp Admin - Salão Larissa

Objetivo: notificar o admin via WhatsApp a cada 5 minutos sobre agendamentos com status `pendente`, no máximo 6 tentativas. As notificações param automaticamente quando o status muda para qualquer outro valor.

## Arquivos criados

- `supabase/migrations/20260608120000_create_appointments_notifications.sql`
- `supabase/functions/notify-pending-appointments/index.ts`
- `supabase/sql/schedule_notify_pending_appointments.sql`

## 1. Aplicar banco de dados

No SQL Editor do Supabase, rode:

```sql
-- Conteúdo de supabase/migrations/20260608120000_create_appointments_notifications.sql
```

Isso cria:

- tipo `appointment_status`;
- tabela `appointments`;
- campos de notificação;
- tabela `whatsapp_notification_logs`;
- índices;
- função `get_pending_admin_notifications`;
- função `register_admin_notification_attempt`.

## 2. Configurar secrets da Edge Function

Escolha um provedor: `evolution`, `meta` ou `ultramsg`.

### Evolution API

```bash
supabase secrets set WHATSAPP_PROVIDER=evolution
supabase secrets set ADMIN_WHATSAPP_PHONE=5564999625616
supabase secrets set EVOLUTION_API_URL=https://sua-evolution-api.com
supabase secrets set EVOLUTION_API_KEY=sua-chave
supabase secrets set EVOLUTION_INSTANCE=sua-instancia
```

### Meta Cloud API

```bash
supabase secrets set WHATSAPP_PROVIDER=meta
supabase secrets set ADMIN_WHATSAPP_PHONE=5564999625616
supabase secrets set META_WHATSAPP_TOKEN=seu-token
supabase secrets set META_PHONE_NUMBER_ID=seu-phone-number-id
```

### UltraMSG

```bash
supabase secrets set WHATSAPP_PROVIDER=ultramsg
supabase secrets set ADMIN_WHATSAPP_PHONE=5564999625616
supabase secrets set ULTRAMSG_INSTANCE_ID=instance00000
supabase secrets set ULTRAMSG_TOKEN=seu-token
```

## 3. Publicar Edge Function

```bash
supabase functions deploy notify-pending-appointments
```

Teste manual:

```bash
supabase functions invoke notify-pending-appointments
```

## 4. Agendar cron a cada 5 minutos

No SQL Editor, configure a URL do projeto e service role key:

```sql
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://SEU-PROJETO.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key = 'SUA_SERVICE_ROLE_KEY';
```

Depois rode:

```sql
-- Conteúdo de supabase/sql/schedule_notify_pending_appointments.sql
```

## 5. Critérios de aceite

- Agendamento `pendente` recebe notificação.
- Nova tentativa só acontece após 5 minutos.
- `notification_count` não passa de 6.
- Ao mudar status para `aprovado`, `recusado`, `cancelado`, `reagendado`, `concluido` ou `faltou`, o agendamento deixa de ser selecionado.
- Cada tentativa gera registro em `whatsapp_notification_logs`.

## 6. Observação MVP

O site estático atual ainda usa `localStorage`. Esta implementação prepara o backend Supabase para a próxima fase, quando o formulário público e o Admin Macro MVP passarem a gravar diretamente na tabela `appointments`.