# BeautyJSR — Agendamento e gestão de salão

MVP de site, agendamento e painel administrativo para salao de beleza. O objetivo e validar uma experiencia simples para clientes reais: ver o salao, escolher servicos, selecionar data, profissional e horario, e enviar o pedido pronto pelo WhatsApp.

## Estado atual

A interface usa HTML, CSS e JavaScript, com arquivos estáticos na raiz. Existe persistência local via `localStorage` e código de integração com Supabase. O modo de autenticação depende da configuração em `supabase-config.js`: sem configuração válida, o login de demonstração é permitido apenas em ambiente local; com configuração válida, o código utiliza Supabase Auth.

O registro histórico de saúde do serviço não garante sua disponibilidade atual. Valide login, permissões e sincronização no ambiente em que estiver executando o projeto.

Ja existe uma base funcional com:

- site publico em abas, evitando rolagem longa entre as areas principais;
- visual premium para salao de beleza, com imagens grandes, cards refinados e tons elegantes;
- painel admin com cara de app, abas, cards, acoes rapidas e layout mais profissional;
- tela de login local para acessar o admin;
- cadastro e edicao de servicos;
- cadastro e edicao de profissionais;
- campo opcional de link por profissional;
- personalizacao do nome do salao, textos, botao, WhatsApp, redes sociais e imagem de fundo;
- upload de imagens para a galeria de trabalhos;
- sincronizacao local entre admin e site pelo botao **Atualizar Site**;
- fluxo de agendamento direto em servicos;
- agenda com selecao de data, profissional, horarios vagos e opcao de encaixe;
- resumo automatico do pedido;
- envio da mensagem pronta para WhatsApp;
- agenda administrativa com status, nota interna e cadastro manual de atendimento;
- controle financeiro inicial com entradas e saidas;
- exportacao dos dados locais em JSON;
- base preparada para evoluir para Supabase Auth, banco de dados online e notificacoes.
- migrations Supabase para servicos, profissionais, galeria, financeiro, configuracoes do site e notificacoes.

## Tecnologias e estrutura

- HTML, CSS e JavaScript para site e painel.
- Supabase Auth e banco de dados na integração online.
- SQL para migrations e TypeScript na função de notificações.
- GitHub Pages e GitHub Actions para publicação estática.

```text
index.html / script.js / styles.css — site público
admin.html / admin.js / admin.css — painel
login.html / auth.js — autenticação
supabase-data.js — acesso aos dados online
supabase/ — migrations, SQL e função de notificações
docs/ — documentação de evolução e configuração
```

## Como executar localmente

Pré-requisitos: Git e Python 3 para o servidor HTTP de desenvolvimento.

```bash
git clone https://github.com/JuscelinoSR/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado.git
cd Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://localhost:8000/` para o site e `http://localhost:8000/login.html` para o login. Encerre o servidor com `Ctrl+C`.

A interface estática não exige `npm install`. A integração online depende da configuração de Supabase e das migrations; consulte [o modelo de autenticação](docs/admin-auth-model.md) e [os próximos passos de integração](docs/SUPABASE-PROXIMO-PASSO.md).

## Como contribuir

Consulte [CONTRIBUTING.md](CONTRIBUTING.md). Ao alterar agendamentos, autenticação ou financeiro, descreva o fluxo validado e as limitações encontradas.

## Acesso administrativo

O acesso administrativo deve ser configurado conforme o ambiente. Consulte `auth.js` e [o modelo de autenticação](docs/admin-auth-model.md). Use o modo de demonstração somente em desenvolvimento local e configure Supabase Auth para a implantação online.

## O que o MVP entrega para o cliente final

O cliente que acessa o site consegue:

- navegar pelas abas principais do salao;
- ver uma apresentacao visual do salao;
- consultar servicos disponiveis;
- escolher um ou mais servicos para atendimento;
- escolher uma data no calendario;
- escolher o profissional;
- ver horarios vagos sugeridos;
- escolher a opcao de encaixe quando precisar;
- preencher nome e observacao;
- revisar o resumo do atendimento;
- enviar tudo pronto para o WhatsApp do salao;
- acessar links sociais cadastrados no painel;
- ver fotos da galeria quando forem adicionadas pelo admin.

## O que o MVP entrega para o administrador

O administrador consegue:

- entrar no painel com usuario e senha local;
- acompanhar indicadores basicos do salao;
- ver pedidos de agendamento recebidos;
- filtrar agendamentos por status, profissional e busca;
- confirmar, alterar status ou excluir pedidos;
- adicionar nota interna ao atendimento;
- criar agendamentos manualmente;
- cadastrar, editar e excluir servicos;
- cadastrar, editar e excluir profissionais;
- adicionar link de perfil para cada profissional;
- editar conteudo principal do site;
- trocar imagem de fundo;
- cadastrar Instagram, Facebook, TikTok e WhatsApp;
- adicionar imagens na galeria de trabalhos;
- atualizar o site com um botao de sincronizacao;
- cadastrar entradas e saidas financeiras;
- visualizar resumo financeiro inicial;
- exportar os dados locais em JSON.

## Fluxo de agendamento atual

1. O cliente abre a aba **Servicos**.
2. Escolhe os servicos desejados.
3. Clica em continuar para agendamento.
4. Escolhe data no calendario.
5. Escolhe profissional.
6. Escolhe horario vago ou **Encaixe**.
7. Informa nome e observacao.
8. Revisa o resumo.
9. Envia a mensagem pronta para WhatsApp.

Configure o número de atendimento adequado ao ambiente antes de compartilhar a demonstração.

## Publicacao

Site publicado pelo GitHub Pages:

https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/

A publicacao usa GitHub Actions e o arquivo `.nojekyll` para servir os assets estaticos corretamente.

## Historico do projeto

Um resumo mais completo da evolucao do MVP esta em:

[docs/HISTORICO-MVP.md](docs/HISTORICO-MVP.md)

Ficha tecnica detalhada do projeto, com estrutura de retomada passo a passo:

[docs/FICHA-TECNICA-PROJETO.md](docs/FICHA-TECNICA-PROJETO.md)

## Supabase

A integração inclui autenticação, persistência online e funções de notificações. Os arquivos de configuração e as migrations estão no repositório; consulte a documentação em `docs/` para entender o fluxo.

Configure seu próprio ambiente e confira login, permissões e sincronização. Registros históricos de disponibilidade não substituem essa validação.

## Proximos passos recomendados

1. Testar login real do admin.
2. Testar fluxo completo em celular.
3. Conferir agendamentos aparecendo no painel.
4. Finalizar Meta Cloud API para notificacoes.
5. Migrar imagens para Supabase Storage.
6. Refinar horarios reais por profissional.
