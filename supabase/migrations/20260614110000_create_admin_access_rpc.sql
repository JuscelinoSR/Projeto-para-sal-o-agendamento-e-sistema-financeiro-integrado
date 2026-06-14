-- RPC segura para o front-end verificar se a sessao atual pertence a um admin ativo.

create or replace function public.is_current_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  );
$$;

revoke all on function public.is_current_admin() from public;
grant execute on function public.is_current_admin() to anon, authenticated;
