# Editor visual do site

O MVP já permite editar a tela inicial pelo `admin.html`, usando dados locais no navegador:

- Nome do salão
- Selo da tela inicial
- Título principal
- Texto de apoio
- Texto do botão de agendamento
- Foto de fundo enviada pelo dispositivo
- Restauração da imagem modelo `assets/salao-cores.jpeg`

O upload usa `<input type="file" accept="image/*">`, então no celular o navegador abre as opções disponíveis do aparelho, como galeria, câmera, arquivos, Google Fotos ou iCloud, conforme o sistema.

## Permissão

A página `admin.html` já usa `data-auth-required` e o fluxo de `auth.js`. Quando o Supabase estiver configurado em `supabase-config.js`, apenas usuários autenticados e ativos em `admin_profiles` conseguem acessar o painel.

## Produção com Supabase

A migration `20260608140000_create_site_settings.sql` cria:

- Tabela `site_settings` para persistir textos e URL da imagem
- Bucket público `site-assets` para fotos do site
- Leitura pública das configurações
- Escrita permitida apenas para usuários ativos em `admin_profiles`

No MVP atual, a edição já funciona via `localStorage`. A próxima evolução é trocar o salvamento local por `site_settings` + Supabase Storage, mantendo a mesma interface do admin.