# Estado atual e proximos passos do Supabase

O Supabase do MVP esta conectado, com migrations aplicadas e seguranca RLS ativa.

## O que ja existe no repositorio

- Modelo de login admin com `admin_profiles`.
- Modelo de configuracoes do site com `site_settings`.
- Modelo de agendamentos pendentes com `appointments`.
- Logs de notificacao em `whatsapp_notification_logs`.
- Edge Function `notify-pending-appointments`.
- SQL para cron a cada 5 minutos.
- SQL de teste para criar agendamento pendente.

## O que ja foi concluido no projeto remoto

- Project URL e chave publica configurados no front-end.
- Todas as migrations locais registradas no banco remoto.
- Login e perfil administrativo ativos.
- Dados privados bloqueados para visitantes.
- Edge Function `notify-pending-appointments` publicada e ativa.
- Provedor selecionado como Meta Cloud API.
- Numero administrativo configurado como `5564999625616`.

## Proximo passo recomendado

1. Criar na Meta o template de utilidade `beautyjsr_novo_agendamento`.
2. Obter o Phone Number ID da conta WhatsApp Business.
3. Gerar um token permanente de sistema.
4. Configurar os secrets `META_PHONE_NUMBER_ID` e `META_WHATSAPP_TOKEN`.
5. Fazer um teste manual controlado da Edge Function.
6. Conferir `appointments` e `whatsapp_notification_logs`.
7. Ativar e validar o cron com `supabase/sql/schedule_notify_pending_appointments.sql`.

## Pendencias conhecidas do MVP

- O numero em `site_settings.whatsapp_number` controla o WhatsApp aberto pelo site.
- A notificacao automatica da Edge Function usa o secret `ADMIN_WHATSAPP_PHONE`, que precisa ser alterado separadamente.
- Fotos da galeria e imagem principal ainda precisam ser migradas para o bucket `site-assets`; o editor mantem uma copia local enquanto esse upload nao for implementado.
- Observacoes do cliente e notas internas do admin ainda nao possuem colunas proprias em `appointments`.
- Depois de aplicar a migration de seguranca, confirme que uma consulta anonima a `appointments` retorna `401` ou uma lista vazia, nunca dados de clientes.

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
