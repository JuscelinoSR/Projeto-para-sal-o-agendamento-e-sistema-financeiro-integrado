-- BeautyJSR MVP core tables.
-- Rode depois da migration de admin_profiles.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists service_catalog (
  id text primary key,
  name text not null,
  duration text not null,
  price text not null,
  price_amount numeric(10,2),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists salon_professionals (
  id text primary key,
  name text not null,
  specialty text not null,
  link_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists work_gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists financial_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  description text not null,
  amount numeric(10,2) not null,
  transaction_date date not null default current_date,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table service_catalog enable row level security;
alter table salon_professionals enable row level security;
alter table work_gallery_images enable row level security;
alter table financial_transactions enable row level security;

drop trigger if exists trg_service_catalog_set_updated_at on service_catalog;
create trigger trg_service_catalog_set_updated_at
before update on service_catalog
for each row execute function set_updated_at();

drop trigger if exists trg_salon_professionals_set_updated_at on salon_professionals;
create trigger trg_salon_professionals_set_updated_at
before update on salon_professionals
for each row execute function set_updated_at();

drop trigger if exists trg_work_gallery_images_set_updated_at on work_gallery_images;
create trigger trg_work_gallery_images_set_updated_at
before update on work_gallery_images
for each row execute function set_updated_at();

drop trigger if exists trg_financial_transactions_set_updated_at on financial_transactions;
create trigger trg_financial_transactions_set_updated_at
before update on financial_transactions
for each row execute function set_updated_at();

drop policy if exists "service_catalog_public_read" on service_catalog;
create policy "service_catalog_public_read"
on service_catalog
for select
using (active = true);

drop policy if exists "salon_professionals_public_read" on salon_professionals;
create policy "salon_professionals_public_read"
on salon_professionals
for select
using (active = true);

drop policy if exists "work_gallery_public_read" on work_gallery_images;
create policy "work_gallery_public_read"
on work_gallery_images
for select
using (active = true);

drop policy if exists "service_catalog_admin_all" on service_catalog;
create policy "service_catalog_admin_all"
on service_catalog
for all
to authenticated
using (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
)
with check (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
);

drop policy if exists "salon_professionals_admin_all" on salon_professionals;
create policy "salon_professionals_admin_all"
on salon_professionals
for all
to authenticated
using (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
)
with check (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
);

drop policy if exists "work_gallery_admin_all" on work_gallery_images;
create policy "work_gallery_admin_all"
on work_gallery_images
for all
to authenticated
using (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
)
with check (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
);

drop policy if exists "financial_transactions_admin_all" on financial_transactions;
create policy "financial_transactions_admin_all"
on financial_transactions
for all
to authenticated
using (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
)
with check (
  exists (
    select 1 from admin_profiles ap
    where ap.id = auth.uid()
      and ap.active = true
  )
);

alter table site_settings add column if not exists instagram_url text default 'https://www.instagram.com/liasouzaoliveira/';
alter table site_settings add column if not exists facebook_url text default '';
alter table site_settings add column if not exists tiktok_url text default '';
alter table site_settings add column if not exists whatsapp_number text default '5564999625616';

insert into service_catalog (id, name, duration, price, price_amount, sort_order)
values
  ('escova-modelada', 'Escova modelada', '45 min', 'R$ 120', 120.00, 10),
  ('hidratacao-profunda', 'Hidratacao profunda', '60 min', 'R$ 160', 160.00, 20),
  ('corte-feminino', 'Corte feminino', '50 min', 'R$ 140', 140.00, 30),
  ('coloracao', 'Coloracao', '120 min', 'A partir de R$ 260', 260.00, 40)
on conflict (id) do update set
  name = excluded.name,
  duration = excluded.duration,
  price = excluded.price,
  price_amount = excluded.price_amount,
  sort_order = excluded.sort_order,
  active = true;

insert into salon_professionals (id, name, specialty, link_url, sort_order)
values
  ('ana-souza', 'Ana Souza', 'Cabelos e finalizacao', '', 10),
  ('beatriz-lima', 'Beatriz Lima', 'Unhas e spa das maos', '', 20),
  ('clara-mendes', 'Clara Mendes', 'Tratamentos capilares', '', 30)
on conflict (id) do update set
  name = excluded.name,
  specialty = excluded.specialty,
  link_url = excluded.link_url,
  sort_order = excluded.sort_order,
  active = true;

create index if not exists idx_service_catalog_active_order
  on service_catalog(active, sort_order, name);

create index if not exists idx_salon_professionals_active_order
  on salon_professionals(active, sort_order, name);

create index if not exists idx_work_gallery_active_order
  on work_gallery_images(active, sort_order, created_at desc);

create index if not exists idx_financial_transactions_date
  on financial_transactions(transaction_date desc, created_at desc);
