# Roadmap BeautyJSR

O projeto está dividido em 3 etapas: MVP de agendamento, operação do salão e plataforma SaaS.

## Etapa 1: MVP de agendamento

Objetivo: permitir que um salão valide a experiência de agendamento com clientes reais, usando um site simples, bonito e funcional.

Status atual: em andamento, com site publicado no GitHub Pages e integracao principal com Supabase ativa.

Funcionalidades já implementadas:

- Site do Salão Larissa em abas.
- Identidade visual baseada na referência enviada do salão.
- Foto de fundo aplicada na página principal.
- Editor visual no Admin Macro para foto, nome, textos e CTA.
- Serviços pré-definidos de salão.
- Serviços editáveis pelo admin.
- Combos prontos.
- Combo personalizado com múltiplos procedimentos e soma automática.
- Calendário visual para escolher data do atendimento.
- Seleção de profissional e período.
- Resumo automático do agendamento.
- Envio de mensagem pronta para WhatsApp.
- Admin Macro MVP para demandas, serviços e profissionais.
- Modelo de autenticação com Supabase Auth.
- Serviços, profissionais, configurações, financeiro e agendamentos conectados ao Supabase.
- RLS aplicada para proteger agendamentos, telefones, logs e RPCs internas.
- Edge Function de notificacao publicada e preparada para Meta Cloud API.
- GitHub Pages com publicacao automatica pela branch `main`.

Pendências da Etapa 1:

- Criar e aprovar o template `beautyjsr_novo_agendamento` na Meta.
- Configurar `META_PHONE_NUMBER_ID` e `META_WHATSAPP_TOKEN` nos secrets do Supabase.
- Fazer um envio manual controlado e conferir os logs de notificacao.
- Ativar e validar o cron de notificacoes a cada 5 minutos.
- Migrar imagem principal e galeria para o Supabase Storage.
- Persistir observacoes do cliente e notas internas do admin.
- Definir horários disponíveis por profissional.
- Validar o fluxo completo em celular.
- Refinar textos finais do salão.

## Etapa 2: Operação do salão

Objetivo: transformar o MVP em ferramenta de rotina para agenda, clientes e financeiro inicial.

Funcionalidades planejadas:

- Agenda com horários reais, status e profissionais.
- Cadastro de clientes.
- Histórico de atendimentos.
- Confirmações e lembretes pelo WhatsApp.
- Controle financeiro inicial com receitas e despesas.
- Painel administrativo com indicadores básicos.

## Etapa 3: Plataforma SaaS BeautyJSR

Objetivo: evoluir para uma plataforma multiempresa, white label e escalável.

Funcionalidades planejadas:

- Multiempresa com isolamento por organização.
- Planos e assinaturas SaaS.
- White label por cliente.
- CRM com automações D+3, D+7, D+14 e D+30.
- Fidelidade, estoque, comissões e avaliações.
- LGPD, auditoria e Row Level Security.
- Internacionalização para português, inglês e espanhol.

## Critério de sucesso do MVP

Um cliente deve conseguir abrir o site, ver os serviços, escolher um combo ou procedimentos personalizados, selecionar data/profissional/período e enviar o pedido para WhatsApp em poucos cliques.
