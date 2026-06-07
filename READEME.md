# 01-PRD-Mestre-v4.0.md

# BeautyJSR

Versão: 4.0

Status: Planejamento Estratégico

Última Atualização: Junho 2026

---

# 1. RESUMO EXECUTIVO

## Visão do Produto

BeautyJSR é uma plataforma SaaS Multiempresa (Multi-Tenant), White Label, Multilíngue e Acessível destinada à gestão completa de negócios de beleza e bem-estar.

A plataforma permite que cada empresa utilize sua própria identidade visual, domínio, idioma, catálogo de serviços, profissionais e automações, mantendo isolamento total dos dados.

---

## Missão

Permitir que empresas de beleza operem, vendam, fidelizem clientes e cresçam utilizando tecnologia simples e acessível.

---

## Público-Alvo

### Inicial

* Salões de Beleza
* Barbearias

### Expansão

* Nail Designers
* Lash Designers
* Micropigmentação
* Clínicas Estéticas
* SPA
* Centros de Bem-Estar
* Massoterapia

---

# 2. PRINCÍPIOS DO PRODUTO

## Multiempresa

O sistema deve suportar múltiplas empresas na mesma infraestrutura.

Toda tabela operacional deve possuir:

organization_id

---

## White Label

Cada organização poderá configurar:

* Nome Fantasia
* Logo
* Favicon
* Cores
* Tipografia
* WhatsApp
* Instagram
* Endereço
* Horários
* Assistente Virtual

---

## Multilíngue

Idiomas iniciais:

* Português (Brasil)
* Inglês
* Espanhol

Nenhum texto poderá ser fixo em componentes.

Utilizar sistema i18n.

Exemplo:

t("schedule_now")

---

## Acessibilidade

Implementar WCAG AA.

Obrigatório:

* Navegação por teclado
* Leitores de tela
* Alto contraste
* Ajuste de fonte
* Estrutura semântica HTML

---

# 3. STACK TECNOLÓGICA

## Frontend

* Next.js 14 App Router
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

* Supabase
* PostgreSQL
* Edge Functions
* Realtime

## Infraestrutura

* Vercel
* Supabase Cloud

## Integrações

* Evolution API
* Google Maps
* Google Calendar

---

# 4. ESTRUTURA DE ORGANIZAÇÃO

## organizations

Representa uma empresa cliente da plataforma.

Campos:

* id
* name
* slug
* logo_url
* favicon_url
* primary_color
* secondary_color
* accent_color
* website
* instagram
* whatsapp
* email
* address
* timezone
* currency
* default_language
* active
* created_at

---

## organization_theme

Configurações de aparência.

Campos:

* organization_id
* font_family
* border_radius
* button_style
* hero_style

---

## locations

Permite múltiplas unidades.

Campos:

* id
* organization_id
* name
* phone
* address
* city
* state
* country
* timezone

---

# 5. GESTÃO DE USUÁRIOS

## users

Campos:

* id
* organization_id
* name
* email
* active

---

## roles

Campos:

* id
* organization_id
* name

Exemplos:

* Owner
* Manager
* Receptionist
* Professional

---

## permissions

Campos:

* id
* code
* description

Exemplos:

* appointments.create
* appointments.edit
* financial.view
* financial.edit
* campaigns.send

---

## role_permissions

Relacionamento entre cargos e permissões.

---

# 6. CLIENTES

## clients

Campos:

* id
* organization_id
* name
* social_name
* phone
* email
* birth_date
* preferred_language
* pronoun
* notes
* loyalty_points
* created_at

---

## Regras

Cliente deve possuir histórico completo.

Todos os atendimentos devem permanecer vinculados.

Jamais excluir histórico.

Utilizar soft delete.

---

# 7. PROFISSIONAIS

## professionals

Campos:

* id
* organization_id
* location_id
* name
* photo_url
* specialty
* bio
* active

---

# 8. SERVIÇOS

## service_categories

Campos:

* id
* organization_id
* name

---

## services

Campos:

* id
* organization_id
* category_id
* name
* description
* duration_minutes
* price
* active

---

# 9. AGENDAMENTOS

## appointments

Campos:

* id
* organization_id
* location_id
* client_id
* professional_id
* service_id
* start_time
* end_time
* status
* notes

---

## Status Permitidos

scheduled

confirmed

completed

cancelled

rescheduled

no_show

---

## Regras

Não permitir conflito de agenda.

Validar disponibilidade do profissional.

Todos os horários devem ser armazenados em UTC.

Exibir conforme timezone da organização.

---

# 10. CRM E WHATSAPP

## message_templates

Campos:

* id
* organization_id
* language
* template_type
* content

---

## whatsapp_campaigns

Campos:

* id
* organization_id
* name
* status
* created_at

---

## whatsapp_message_logs

Campos:

* id
* organization_id
* phone
* message
* status
* sent_at

---

# Fluxos Automáticos

## D+3

Enviar cuidados pós-atendimento.

## D+7

Sugerir produtos.

## D+14

Lembrete de manutenção.

## D+30

Convite para reagendamento.

## Aniversário

Enviar cupom promocional.

---

# 11. FIDELIDADE

## loyalty_cards

Campos:

* id
* organization_id
* client_id
* current_progress
* target

---

## Regra Inicial

5 serviços concluídos

↓

1 serviço gratuito

Configuração editável por empresa.

---

# 12. LISTA DE ESPERA

## waiting_list

Campos:

* id
* organization_id
* client_id
* desired_date
* period
* status

---

## Fluxo

Cancelamento

↓

Buscar primeiro cliente elegível

↓

Enviar WhatsApp

↓

Reservar vaga

---

# 13. ESTOQUE

## inventory_products

Campos:

* id
* organization_id
* name
* brand
* quantity
* minimum_quantity
* cost_price
* sale_price

---

## inventory_movements

Campos:

* id
* product_id
* movement_type
* quantity
* created_at

---

## Regras

Toda movimentação deve gerar auditoria.

Baixa automática ao concluir atendimento.

---

# 14. FINANCEIRO

## payments

Campos:

* id
* organization_id
* appointment_id
* amount
* payment_method
* paid_at

---

## expenses

Campos:

* id
* organization_id
* category
* description
* amount
* expense_date

---

## Dashboard

Indicadores:

* Receita
* Despesa
* Lucro
* Margem
* Ticket Médio
* Receita por Profissional

---

# 15. COMISSÕES

## commission_rules

Campos:

* id
* organization_id
* professional_id
* category_id
* percentage

---

## Regras

Permitir regra:

* por profissional
* por categoria
* por serviço

---

# 16. AVALIAÇÕES

## reviews

Campos:

* id
* organization_id
* appointment_id
* client_id
* rating
* comment

---

# 17. LGPD

## consents

Campos:

* id
* client_id
* privacy_consent
* marketing_consent
* image_consent
* accepted_at

---

## data_requests

Campos:

* id
* client_id
* request_type

Tipos:

* export
* delete

---

# 18. AUDITORIA

## audit_logs

Campos:

* id
* organization_id
* user_id
* table_name
* record_id
* action
* old_data
* new_data
* created_at

---

# 19. SEGURANÇA

## RLS Obrigatório

Toda tabela deve possuir Row Level Security.

---

### Cliente

Pode visualizar apenas seus próprios dados.

---

### Funcionário

Pode visualizar apenas dados da organização.

---

### Owner

Acesso total à organização.

---

# 20. SAAS BILLING

## plans

Campos:

* id
* name
* price
* max_users
* max_locations
* features

---

## subscriptions

Campos:

* id
* organization_id
* plan_id
* status
* started_at
* expires_at

---

# 21. CRITÉRIOS DE QUALIDADE

## Performance

Lighthouse mínimo:

* Performance > 90
* SEO > 90
* Accessibility > 90
* Best Practices > 90

---

## Código

* TypeScript Strict
* ESLint
* Prettier
* Sem warnings

---

# 22. ROADMAP

## V1

Core Operacional

## V2

CRM e WhatsApp

## V3

Estoque e Comissões

## V4

Financeiro

## V5

Multiempresa + SaaS Billing

## V6

IA e Analytics

---

# 23. VISÃO FUTURA

O BeautyJSR deve evoluir para uma plataforma global de gestão para empresas de beleza e bem-estar, oferecendo operação, CRM, automação, estoque, financeiro, marketing e inteligência artificial em um único ecossistema.
