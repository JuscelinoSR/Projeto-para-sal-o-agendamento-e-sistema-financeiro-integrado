# BeautyJSR / Salão Larissa MVP

Site e MVP de agendamento para salão feminino, com atendimento guiado, serviços editáveis, calendário de agendamento, resumo automático e envio para WhatsApp.

## Estado atual

O MVP publicado já possui:

- página principal em abas, sem rolagem longa entre áreas principais;
- visual do Salão Larissa com foto de fundo editável;
- fluxo de agendamento direto na aba Serviços;
- seleção entre Combo pronto e Personalizado;
- seleção de vários procedimentos no modo personalizado, com soma automática do valor;
- calendário visual para escolher a data do atendimento;
- seleção de profissional e período;
- resumo automático do agendamento;
- mensagem pronta para WhatsApp;
- Admin Macro MVP para demandas, serviços, profissionais e personalização visual;
- modelo inicial de autenticação do admin com Supabase Auth;
- base Supabase para notificação WhatsApp Admin de agendamentos pendentes.

## Publicação

Site publicado pelo GitHub Pages:

https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/

A publicação usa GitHub Actions e o arquivo `.nojekyll` para servir os assets estáticos corretamente.

## Fluxo de agendamento

1. O cliente abre a aba Serviços.
2. Escolhe Combo pronto ou Personalizado.
3. No Personalizado, pode marcar mais de um procedimento.
4. O resumo calcula e mostra o valor total.
5. O cliente clica em Continuar para agendamento.
6. Escolhe a data no calendário, profissional e período.
7. Informa nome e observação.
8. Envia a mensagem pronta para o WhatsApp.

WhatsApp configurado para o MVP: `5564999625616`.

## Admin Macro MVP

Painel administrativo inicial: `admin.html`.

Funções disponíveis:

- visualizar demandas criadas no site;
- acompanhar data, período, profissional, serviço e observação;
- alterar status da demanda;
- adicionar nota interna;
- cadastrar, editar e excluir serviços;
- cadastrar, editar e excluir profissionais;
- editar nome do salão, texto da página, CTA e foto de fundo;
- enviar foto a partir do dispositivo do usuário;
- exportar dados locais em JSON.

Nesta versão MVP, os dados ficam no `localStorage` do navegador. A próxima etapa é migrar demandas, serviços, profissionais e configurações visuais para Supabase.

## Autenticação Admin

Modelo criado com Supabase Auth, e-mail e senha.

Arquivos principais:

- `login.html`
- `auth.js`
- `supabase-config.js`
- `supabase/migrations/20260608130000_create_admin_auth_model.sql`
- `docs/admin-auth-model.md`

Observação: `supabase-config.js` ainda precisa receber a URL e a anon key reais do projeto Supabase para ativar a autenticação em produção.

## Notificação WhatsApp Admin

Base criada para notificar o admin do Salão Larissa a cada 5 minutos sobre agendamentos pendentes, com limite de 6 tentativas e parada automática quando o status muda.

Documentação: `docs/whatsapp-admin-notifications.md`.

Arquivos principais:

- `supabase/migrations/20260608120000_create_appointments_notifications.sql`
- `supabase/functions/notify-pending-appointments/index.ts`
- `supabase/sql/schedule_notify_pending_appointments.sql`

## Próximos passos

- Conectar Supabase real no `supabase-config.js`.
- Migrar dados do `localStorage` para tabelas Supabase.
- Implementar agenda com horários reais por profissional.
- Conectar envio de notificação WhatsApp Admin.
- Transformar o MVP estático em app Next.js quando a validação visual estiver aprovada.
