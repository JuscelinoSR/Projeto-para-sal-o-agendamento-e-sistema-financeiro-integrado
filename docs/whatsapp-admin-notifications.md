# Notificacao WhatsApp Admin - Salao Larissa

Objetivo: notificar o admin via WhatsApp a cada 5 minutos sobre agendamentos com status `pendente`, no maximo 6 tentativas. As notificacoes param automaticamente quando o status muda para qualquer outro valor.

## Status atual

Esta parte esta pronta no codigo, mas so roda depois que o projeto Supabase real estiver configurado.

Para ficar ativa, ainda e necessario:

- aplicar a migration no banco Supabase;
- configurar os secrets da Edge Function;
- publicar a Edge Function;
- configurar o cron de 5 minutos;
- criar pelo menos um agendamento `pendente` na tabela `appointments`.

## Arquivos criados

- `supabase/migrations/20260608120000_create_appointments_notifications.sql`
- `supabase/functions/notify-pending-appointments/index.ts`
- `supabase/sql/schedule_notify_pending_appointments.sql`
- `supabase/sql/test_pending_appointment_seed.sql`

## 1. Aplicar banco de dados

No SQL Editor do Supabase, rode:

```sql
-- Conteudo de supabase/migrations/20260608120000_create_appointments_notifications.sql
```

Isso cria:

- tipo `appointment_status`;
- tabela `appointments`;
- campos de notificacao;
- tabela `whatsapp_notification_logs`;
- indices;
- funcao `get_pending_admin_notifications`;
- funcao `register_admin_notification_attempt`.

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

Se estiver testando pelo dashboard do Supabase, abra a Edge Function publicada e use a opcao de invoke/teste.

## 4. Agendar cron a cada 5 minutos

No SQL Editor, configure a URL do projeto e service role key:

```sql
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://SEU-PROJETO.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key = 'SUA_SERVICE_ROLE_KEY';
```

Depois rode:

```sql
-- Conteudo de supabase/sql/schedule_notify_pending_appointments.sql
```

## 5. Criar um agendamento pendente de teste

No SQL Editor, rode:

```sql
-- Conteudo de supabase/sql/test_pending_appointment_seed.sql
```

Depois invoque a funcao `notify-pending-appointments`.

Para conferir o resultado:

```sql
select
  id,
  client_name,
  status,
  notification_count,
  last_notification_sent_at,
  admin_notified_at
from appointments
order by created_at desc
limit 5;

select
  appointment_id,
  provider,
  admin_phone,
  status,
  attempt_number,
  response_status,
  error_message,
  created_at
from whatsapp_notification_logs
order by created_at desc
limit 10;
```

Se o provedor de WhatsApp nao estiver configurado, o teste ainda deve registrar uma tentativa com `status = failed` e uma mensagem clara em `error_message`.

## 6. Criterios de aceite

- Agendamento `pendente` recebe notificacao.
- Nova tentativa so acontece apos 5 minutos.
- `notification_count` nao passa de 6.
- Ao mudar status para `aprovado`, `recusado`, `cancelado`, `reagendado`, `concluido` ou `faltou`, o agendamento deixa de ser selecionado.
- Cada tentativa gera registro em `whatsapp_notification_logs`.

## 7. Observacao MVP

O site estatico atual ainda usa `localStorage`. Esta implementacao prepara o backend Supabase para a proxima fase, quando o formulario publico e o Admin Macro MVP passarem a gravar diretamente na tabela `appointments`.
