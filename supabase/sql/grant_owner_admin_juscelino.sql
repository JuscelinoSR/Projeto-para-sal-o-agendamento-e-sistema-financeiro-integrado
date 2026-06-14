-- Libera o usuario admin principal depois que ele for criado em Authentication > Users.
-- Rode somente depois de criar o usuario juscelinosilvatit@gmail.com no Supabase Auth.

insert into admin_profiles (id, email, full_name, role, active)
select
  id,
  email,
  'Juscelino Silva',
  'owner',
  true
from auth.users
where email = 'juscelinosilvatit@gmail.com'
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = 'owner',
  active = true,
  updated_at = now()
returning id, email, full_name, role, active;
