# BeautyJSR / Salao Larissa MVP

MVP de site, agendamento e painel administrativo para salao de beleza. O objetivo e validar uma experiencia simples para clientes reais: ver o salao, escolher servicos, selecionar data, profissional e horario, e enviar o pedido pronto pelo WhatsApp.

## Estado atual

O projeto esta em modo MVP estatico, com dados salvos no navegador via `localStorage`. Isso permite testar rapido no computador antes da conexao final com Supabase.

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

## Login local do admin

Enquanto o Supabase nao estiver configurado, o painel usa login local de teste:

```text
Usuario: admin
Senha: admin123
```

Esse login serve apenas para desenvolvimento local. Em producao, o correto e configurar Supabase Auth.

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

WhatsApp configurado para o MVP: `5564999625616`.

## Publicacao

Site publicado pelo GitHub Pages:

https://juscelinosr.github.io/Projeto-para-sal-o-agendamento-e-sistema-financeiro-integrado/

A publicacao usa GitHub Actions e o arquivo `.nojekyll` para servir os assets estaticos corretamente.

## Historico do projeto

Um resumo mais completo da evolucao do MVP esta em:

[docs/HISTORICO-MVP.md](docs/HISTORICO-MVP.md)

## Supabase

O Supabase ainda nao esta configurado com credenciais reais. O arquivo `supabase-config.js` precisa receber:

```js
url: "https://SEU-PROJETO.supabase.co",
anonKey: "SUA_SUPABASE_ANON_KEY"
```

Quando isso for configurado, o projeto podera evoluir para:

- login real com email e senha;
- banco de dados online;
- agenda compartilhada entre dispositivos;
- dados persistidos fora do navegador;
- regras de seguranca;
- notificacoes e automacoes.

## Proximos passos recomendados

1. Configurar Supabase real.
2. Criar tabelas online para servicos, profissionais, agendamentos, financeiro e configuracoes.
3. Migrar `localStorage` para Supabase.
4. Publicar uma versao final em GitHub Pages ou Vercel.
5. Testar o fluxo completo em celular.
6. Refinar horarios reais por profissional.
