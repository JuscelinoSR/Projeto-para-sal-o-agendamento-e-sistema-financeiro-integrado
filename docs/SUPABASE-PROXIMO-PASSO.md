# Proximo passo: ativar Supabase do MVP

Este roteiro transforma a base local do MVP em uma base pronta para teste no Supabase.

## O que ja existe no repositorio

- Modelo de login admin com `admin_profiles`.
- Modelo de configuracoes do site com `site_settings`.
- Modelo de agendamentos pendentes com `appointments`.
- Logs de notificacao em `whatsapp_notification_logs`.
- Edge Function `notify-pending-appointments`.
- SQL para cron a cada 5 minutos.
- SQL de teste para criar agendamento pendente.

## O que ainda falta fora do codigo

Voce precisa criar ou abrir um projeto no Supabase e pegar:

- Project URL.
- Anon public key.
- Service role key.
- Provedor de WhatsApp, como Evolution API, Meta Cloud API ou UltraMSG.

## Ordem recomendada

1. Criar projeto no Supabase.
2. Rodar as migrations no SQL Editor:
   - `supabase/migrations/20260608130000_create_admin_auth_model.sql`
   - `supabase/migrations/20260608140000_create_site_settings.sql`
   - `supabase/migrations/20260614100000_create_mvp_core_tables.sql`
   - `supabase/migrations/20260608120000_create_appointments_notifications.sql`
3. Criar usuario em Authentication > Users.
4. Liberar esse usuario em `admin_profiles`.
5. Atualizar `supabase-config.js` com Project URL e anon key.
6. Configurar secrets da Edge Function.
7. Publicar a Edge Function `notify-pending-appointments`.
8. Rodar `supabase/sql/test_pending_appointment_seed.sql`.
9. Invocar a Edge Function manualmente.
10. Conferir `appointments` e `whatsapp_notification_logs`.
11. Se tudo estiver correto, rodar `supabase/sql/schedule_notify_pending_appointments.sql`.

## Credenciais que nao devem ir para o GitHub

Nunca coloque no repositorio:

- service role key;
- tokens de WhatsApp;
- senha real de admin;
- chaves privadas.

O arquivo `supabase-config.js` pode receber apenas a anon public key, que e propria para uso no navegador.

## Resultado esperado do teste

Depois de criar um agendamento pendente e invocar a funcao:

- `appointments.notification_count` deve aumentar para `1`;
- `appointments.last_notification_sent_at` deve ser preenchido;
- `whatsapp_notification_logs` deve receber um registro;
- se o WhatsApp estiver configurado, o admin recebe a mensagem;
- se o WhatsApp nao estiver configurado, o log registra falha clara.
