# Ficha Tecnica do Projeto BeautyJSR / Salao Larissa

Este documento explica o projeto como se estivessemos comecando hoje. A ideia e servir como guia de retomada, manutencao e evolucao do sistema.

## 1. Visao geral

O projeto e um MVP para um salao de beleza, com site publico, fluxo de agendamento, painel administrativo, banco de dados online no Supabase e publicacao pelo GitHub Pages.

Nome do produto:

- BeautyJSR / Salao Larissa MVP

Objetivo principal:

- Permitir que clientes vejam servicos, escolham data, profissional e horario, e enviem um pedido de agendamento.
- Permitir que o administrador acompanhe agendamentos, edite servicos, profissionais, dados do site e financeiro inicial.

Links principais:

- Site publico: https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/
- Painel admin: https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/admin.html
- Repositorio GitHub: https://github.com/JuscelinoSR/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado.git

## 2. Estrutura local organizada

A pasta principal do computador e apenas a area de trabalho:

```text
C:\Users\jusce\OneDrive\Documentos\Projeto para salão de cabelo
```

Dentro dela, o projeto oficial fica em:

```text
repositorio-salao-oficial
```

Pastas organizadas:

- `repositorio-salao-oficial`: repositorio oficial do projeto do salao.
- `arquivo-studio-belleza`: versao antiga estatica arquivada.
- `outros-projetos`: projetos que nao fazem parte do salao.

Observacao importante:

- A pasta principal nao e mais um repositorio Git.
- O Git correto fica somente dentro de `repositorio-salao-oficial`.

## 3. Como recomecar do zero hoje

1. Abra a pasta oficial:

```text
C:\Users\jusce\OneDrive\Documentos\Projeto para salão de cabelo\repositorio-salao-oficial
```

2. Confira o estado do Git:

```bash
git status --short --branch
```

O esperado e:

```text
## main...origin/main
```

3. Abra o site publicado:

```text
https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/
```

4. Abra o painel admin:

```text
https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/admin.html
```

5. Entre no painel usando o usuario admin liberado no Supabase:

```text
E-mail: juscelinosilvatit@gmail.com
Senha: senha cadastrada no Supabase Auth
```

6. Se o Supabase estiver pausado, retome pelo painel da Supabase:

```text
https://supabase.com/dashboard/project/gnzgqefwsgjsjrktgpej
```

## 4. Tecnologias usadas

Frontend:

- HTML estatico.
- CSS puro.
- JavaScript puro.
- Supabase JS via CDN.

Backend / dados:

- Supabase.
- PostgreSQL.
- Supabase Auth.
- Row Level Security.
- Supabase Edge Functions.

Publicacao:

- GitHub Pages.
- GitHub Actions.

Integracao futura de notificacoes:

- Meta Cloud API para WhatsApp.

## 5. Arquivos principais

Site publico:

- `index.html`: estrutura do site publico.
- `styles.css`: visual do site publico.
- `script.js`: fluxo de agendamento, carregamento de dados e envio para WhatsApp.

Painel administrativo:

- `admin.html`: estrutura do painel.
- `admin.css`: visual do painel.
- `admin.js`: regras do painel, agenda, catalogo, financeiro e personalizacao.
- `login.html`: tela de login admin.
- `auth.js`: controle de sessao, login e permissao admin.

Supabase:

- `supabase-config.js`: URL e chave publica anon do Supabase.
- `supabase-data.js`: camada de leitura e escrita no Supabase.
- `supabase/migrations`: estrutura do banco e politicas de seguranca.
- `supabase/functions/notify-pending-appointments`: Edge Function para notificacoes.
- `supabase/sql`: scripts manuais de apoio.

Documentacao:

- `README.md`: resumo do projeto.
- `ROADMAP.md`: etapas planejadas.
- `docs/PROMPT-RETOMADA.md`: prompt para retomar o projeto.
- `docs/SUPABASE-PROXIMO-PASSO.md`: orientacoes de Supabase.
- `docs/whatsapp-admin-notifications.md`: plano da Meta Cloud API.

## 6. Estado atual do Supabase

Projeto Supabase:

- Nome: `JuscelinoSR's Projeto para salão de beleza`
- Ref: `gnzgqefwsgjsjrktgpej`
- Regiao: `us-west-2`
- Status conferido em 18/07/2026: `ACTIVE_HEALTHY`

O projeto ficou pausado por inatividade e foi retomado. Depois da retomada:

- DNS voltou a resolver.
- API REST voltou a responder.
- Migrations remotas voltaram aplicadas.
- Tabela `service_catalog` voltou a responder com dados reais.
- Usuario `juscelinosilvatit@gmail.com` foi liberado como `owner` e `active=true`.

## 7. Migrations aplicadas

As migrations locais e remotas estao alinhadas:

- `20260608120000_create_appointments_notifications.sql`
- `20260608130000_create_admin_auth_model.sql`
- `20260608140000_create_site_settings.sql`
- `20260614100000_create_mvp_core_tables.sql`
- `20260614110000_create_admin_access_rpc.sql`
- `20260622010000_secure_appointments_access.sql`
- `20260622020000_harden_supabase_security.sql`

Essas migrations criam e protegem:

- agendamentos;
- logs de notificacao;
- perfis admin;
- configuracoes do site;
- catalogo de servicos;
- profissionais;
- galeria;
- financeiro;
- funcoes RPC internas;
- politicas RLS.

## 8. Seguranca aplicada

O projeto usa RLS para proteger dados sensiveis.

Regras importantes:

- Publico pode ler catalogo, profissionais, galeria e configuracoes publicas.
- Publico pode criar agendamento pendente.
- Publico nao pode listar telefones de clientes nem agendamentos.
- Admin autenticado pode gerenciar dados operacionais.
- RPCs internas de notificacao foram bloqueadas para navegador e liberadas apenas para `service_role`.
- `appointments` e `whatsapp_notification_logs` estao com RLS ativo.

Funcoes de permissao:

- `is_current_admin()`
- `is_current_owner()`

Admin principal:

```text
juscelinosilvatit@gmail.com
role: owner
active: true
```

## 9. Publicacao no GitHub Pages

O site e publicado automaticamente quando existe push na branch `main`.

Workflow ativo:

```text
.github/workflows/deploy-pages.yml
```

Um workflow duplicado chamado `pages.yml` foi removido porque estava causando risco de publicacao conflitante.

Ultima correcao de publicacao:

- O GitHub Pages estava servindo uma pagina antiga do BeautyJSR SaaS.
- Foi feito novo deploy.
- A URL publica passou a entregar `Salão Larissa | Seu momento de cuidado`.

## 10. Fluxo do cliente

1. Cliente abre o site.
2. Entra na area de servicos.
3. Escolhe um ou mais servicos.
4. Avanca para agenda.
5. Escolhe data.
6. Escolhe profissional.
7. Escolhe horario.
8. Informa nome e WhatsApp.
9. Adiciona observacao se quiser.
10. Envia o pedido.
11. O sistema salva o agendamento no Supabase e prepara contato pelo WhatsApp.

## 11. Fluxo do administrador

1. Admin abre `admin.html`.
2. Sistema redireciona para `login.html` se nao houver sessao.
3. Admin entra com e-mail e senha do Supabase Auth.
4. `auth.js` verifica se o usuario esta em `admin_profiles`.
5. Se estiver ativo, painel abre.
6. `admin.js` carrega dados pelo `supabase-data.js`.
7. Admin gerencia:

- dashboard;
- agenda;
- catalogo;
- profissionais;
- financeiro;
- personalizacao do site.

Botao importante:

- `Atualizar Site`: salva configuracoes, catalogo e profissionais no Supabase.

## 12. WhatsApp e Meta Cloud API

O envio automatico via Meta Cloud API esta preparado, mas ainda nao esta finalizado.

Edge Function:

```text
notify-pending-appointments
```

Secrets ja definidos:

- `ADMIN_WHATSAPP_PHONE`
- `WHATSAPP_PROVIDER`
- `META_TEMPLATE_NAME`
- `META_TEMPLATE_LANGUAGE`

Pendentes:

- `META_PHONE_NUMBER_ID`
- `META_WHATSAPP_TOKEN`

Template planejado:

```text
beautyjsr_novo_agendamento
```

Idioma:

```text
pt_BR
```

Antes de ativar notificacoes reais:

1. Criar e aprovar o template no Meta Business.
2. Obter Phone Number ID.
3. Gerar token permanente.
4. Salvar secrets no Supabase.
5. Fazer um disparo manual controlado.
6. Verificar `whatsapp_notification_logs`.
7. Ativar cron de 5 minutos.

## 13. Como testar agora

Teste rapido do site:

1. Abra o site publico.
2. Confira se aparece `Salão Larissa`.
3. Acesse a aba `Serviços`.
4. Escolha um servico.
5. Escolha data, profissional e horario.
6. Preencha nome e telefone.
7. Envie o pedido.

Teste rapido do admin:

1. Abra o painel admin.
2. Faca login com `juscelinosilvatit@gmail.com`.
3. Veja se o dashboard carrega dados do Supabase.
4. Acesse `Agenda`.
5. Confira se o agendamento criado aparece.
6. Teste mudar status para confirmado.
7. Teste `Atualizar Site`.

Teste rapido do Supabase:

```bash
supabase migration list --linked
```

Teste da API publica:

```text
GET https://gnzgqefwsgjsjrktgpej.supabase.co/rest/v1/service_catalog?select=id,name&limit=1
```

Resultado esperado:

```json
[
  {
    "id": "escova-modelada",
    "name": "Escova modelada"
  }
]
```

## 14. Problemas ja resolvidos

Pasta workspace misturada:

- Separado projeto oficial, arquivo antigo e outros projetos.
- Removido `.git` vazio da pasta principal.

Publicacao errada:

- GitHub Pages estava exibindo uma pagina antiga.
- Workflow duplicado foi removido.
- Deploy corrigido.

Supabase pausado:

- Projeto estava `INACTIVE`.
- Foi retomado pelo painel Supabase.
- Voltou para `ACTIVE_HEALTHY`.

Admin sem acesso:

- Usuario `juscelinosilvatit@gmail.com` foi liberado como `owner/admin`.

Seguranca Supabase:

- RLS reforcado.
- Agendamentos e logs protegidos.
- RPCs internas protegidas.

## 15. Pendencias importantes

Prioridade alta:

- Entrar no painel admin e validar login real.
- Fazer teste completo pelo celular.
- Confirmar que agendamentos aparecem no admin.
- Criar template da Meta Cloud API.
- Configurar `META_PHONE_NUMBER_ID` e `META_WHATSAPP_TOKEN`.

Prioridade media:

- Persistir imagens no Supabase Storage.
- Melhorar cadastro de horarios por profissional.
- Adicionar observacoes completas no schema de agendamentos.
- Criar bloqueio de conflito de horario.

Prioridade futura:

- Cadastro de clientes.
- Historico de atendimentos.
- Comissoes.
- Estoque.
- Planos SaaS.
- Multiempresa.

## 16. Recomendacao de continuidade

Se estivessemos comecando hoje, a ordem recomendada seria:

1. Confirmar que o Supabase esta ativo.
2. Confirmar login do admin.
3. Fazer agendamento teste pelo celular.
4. Conferir agendamento no painel.
5. Testar `Atualizar Site`.
6. Ajustar textos, servicos, profissionais e WhatsApp.
7. Finalizar Meta Cloud API.
8. Migrar imagens para Storage.
9. Implementar agenda real por profissional.
10. Preparar uma versao demonstravel para clientes reais.

## 17. Prompt para retomar com Codex

Use este prompt quando voltar ao projeto:

```text
Quero retomar o projeto BeautyJSR / Salao Larissa.
Abra a pasta repositorio-salao-oficial, leia docs/FICHA-TECNICA-PROJETO.md, ROADMAP.md, docs/PROMPT-RETOMADA.md e docs/SUPABASE-PROXIMO-PASSO.md.
Primeiro verifique git status, depois confirme se o Supabase gnzgqefwsgjsjrktgpej esta ativo.
Em seguida, teste o site publicado, o painel admin e o fluxo de agendamento.
Nao envie mensagens reais de WhatsApp sem minha confirmacao.
```
