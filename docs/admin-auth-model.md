# Modelo de Autenticação Admin

Este modelo protege o `admin.html` com Supabase Auth usando e-mail e senha.

## Arquivos

- `login.html`: tela de entrada do admin.
- `auth.js`: login, validação de sessão, validação de perfil admin e logout.
- `supabase-config.js`: configuração pública do Supabase no front-end.
- `supabase/migrations/20260608130000_create_admin_auth_model.sql`: tabela `admin_profiles` e políticas RLS.

## Como configurar

1. Crie ou abra o projeto no Supabase.
2. No SQL Editor, rode a migration `20260608130000_create_admin_auth_model.sql`.
3. Vá em Authentication > Users e crie o usuário com e-mail e senha.
4. Libere esse usuário como admin no SQL Editor:

```sql
INSERT INTO admin_profiles (id, email, full_name, role)
SELECT id, email, 'Larissa Admin', 'owner'
FROM auth.users
WHERE email = 'admin@salaolarissa.com'
ON CONFLICT (id) DO UPDATE SET active = TRUE, role = EXCLUDED.role;
```

5. Edite `supabase-config.js` com:

```js
window.BEAUTYJSR_SUPABASE = {
  url: 'https://SEU-PROJETO.supabase.co',
  anonKey: 'SUA_SUPABASE_ANON_KEY',
  adminRedirect: 'admin.html',
  loginRedirect: 'login.html',
};
```

Use a `anon public key`. Nunca coloque a `service_role key` no navegador.

## Comportamento

- Quem acessa `admin.html` sem sessão é enviado para `login.html`.
- Quem faz login mas não existe em `admin_profiles` ativo é desconectado.
- O botão `Sair` encerra a sessão.
- Enquanto `supabase-config.js` não for configurado, o admin fica bloqueado com aviso.

## Limite do MVP

A autenticação protege a tela, mas os dados do Admin Macro ainda usam `localStorage`. A próxima etapa é migrar demandas, serviços e profissionais para tabelas Supabase com RLS.