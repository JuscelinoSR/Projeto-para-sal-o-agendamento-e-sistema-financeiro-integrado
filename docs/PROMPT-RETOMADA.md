# Prompt de retomada do BeautyJSR

Use este texto ao retomar o projeto:

```text
Quero continuar o projeto BeautyJSR no repositorio `repositorio-salao-oficial`.

Antes de alterar codigo, leia `ROADMAP.md`, `docs/SUPABASE-PROXIMO-PASSO.md`,
`docs/whatsapp-admin-notifications.md` e confira `git status`.

Estado atual:

- O site esta publicado no GitHub Pages:
  https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/
- O painel esta em:
  https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/admin.html
- A branch `main` esta sincronizada com `origin/main`.
- O Supabase esta vinculado ao projeto `gnzgqefwsgjsjrktgpej`.
- Todas as migrations, incluindo as migrations de seguranca
  `20260622010000` e `20260622020000`, estao aplicadas remotamente.
- A RLS impede visitantes de ler agendamentos, telefones e logs.
- As RPCs internas de notificacao estao restritas ao `service_role`.
- A Edge Function `notify-pending-appointments` esta publicada, ativa e na versao 5.
- O banco passou no `supabase db lint` sem erros.
- O provedor escolhido e a Meta WhatsApp Cloud API.
- O numero administrativo mantido e `5564999625616`.
- Os secrets nao sensiveis ja configurados sao:
  `WHATSAPP_PROVIDER=meta`, `META_TEMPLATE_NAME=beautyjsr_novo_agendamento`
  e `META_TEMPLATE_LANGUAGE=pt_BR`.
- Nunca grave tokens, service role key ou senhas no GitHub.

O que foi feito na ultima sessao:

- Conectamos site e painel ao Supabase com fallback local.
- Corrigimos login e removemos email/validade da URL do painel.
- Adicionamos telefone obrigatorio ao agendamento.
- Ativamos a publicacao automatica do GitHub Pages.
- Aplicamos policies RLS e bloqueamos a exposicao publica de dados.
- Corrigimos horarios de Manha, Tarde e Noite.
- Publicamos a Edge Function e adicionamos suporte a templates da Meta.
- Configuramos o numero administrativo no secret `ADMIN_WHATSAPP_PHONE`.

Proximo objetivo:

Concluir a integracao Meta Cloud API. Primeiro confirme o estado atual sem
disparar mensagens. Depois me ajude a:

1. Criar e aprovar na Meta o template de utilidade
   `beautyjsr_novo_agendamento`, idioma `pt_BR`, com 8 parametros.
2. Obter o `META_PHONE_NUMBER_ID`.
3. Gerar um token permanente e configurar `META_WHATSAPP_TOKEN` com seguranca.
4. Fazer um unico teste manual controlado, somente depois da minha confirmacao.
5. Conferir `whatsapp_notification_logs`.
6. Ativar e validar o cron de 5 minutos.

Pendencias posteriores:

- Enviar imagem principal e galeria ao bucket `site-assets`.
- Persistir observacoes do cliente e notas internas do admin.
- Criar horarios reais por profissional e bloquear conflitos.
- Validar todo o fluxo no celular.

Implemente e valide as correcoes necessarias. Nao exponha credenciais e nao
envie mensagens reais sem confirmacao no momento do teste.
```
