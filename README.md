# Projeto para salão: agendamento e sistema financeiro integrado

SaaS de agendamento para salões femininos via WhatsApp. Site elegante + assistente virtual "Ana" com fluxo de 3 cliques, sem digitar. Painel administrativo com dashboard e QR Code para conectar o WhatsApp. Stack planejada: Next.js, TypeScript, Tailwind, Supabase. Design acolhedor e mobile-first.

## Divisão do projeto

O BeautyJSR será construído em 3 etapas:

1. MVP de agendamento: site, serviços, profissionais e contato pelo WhatsApp.
2. Operação do salão: agenda, clientes, histórico, serviços e financeiro inicial.
3. Plataforma SaaS: multiempresa, white label, CRM, fidelidade, estoque, comissões, LGPD e billing.

## Primeira opção de MVP

A primeira opção recomendada é o **BeautyJSR Agenda**, um MVP simples para validar o produto com salões reais.

Inclui:

- landing page profissional;
- lista de serviços;
- lista de profissionais;
- chamada para agendamento pelo WhatsApp;
- prévia visual do painel;
- base para evoluir depois para Next.js e Supabase.

Veja o planejamento completo em [ROADMAP.md](ROADMAP.md).

## Publicação

O site está configurado para publicação pelo GitHub Pages usando GitHub Actions.

URL prevista após o deploy:

https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/

Se o primeiro deploy pedir habilitação no GitHub, abra o repositório em Settings > Pages e selecione GitHub Actions como fonte de publicação.
## Funções implementadas no MVP

- Seleção de serviço.
- Seleção de profissional.
- Seleção de período preferido.
- Campo para nome do cliente.
- Campo de observação.
- Resumo automático do agendamento.
- Geração de mensagem pronta para WhatsApp.

WhatsApp configurado para o MVP: `5564999625616`.
## Admin Macro MVP

O projeto agora possui um painel administrativo inicial em [admin.html](admin.html).

Funções do admin:

- visualizar demandas de agendamento criadas no site;
- alterar status da demanda: novo, em atendimento, confirmado, concluído ou cancelado;
- adicionar nota interna da equipe;
- cadastrar, editar e excluir serviços;
- cadastrar, editar e excluir profissionais;
- exportar os dados locais em JSON.

Nesta versão MVP, os dados ficam salvos no `localStorage` do navegador. A próxima etapa é migrar essas informações para Supabase.
## Paleta visual

A identidade visual do MVP foi ajustada a partir da referência do salão: off-white iluminado, blush quente, taupe/sálvia, cobre e marrom profundo.