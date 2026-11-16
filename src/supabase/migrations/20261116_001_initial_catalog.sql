
-- 1. CATEGORÍAS
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  position integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. PRODUCTOS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id)
    on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  cover_image text,
  featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. IMÁGENES DE PRODUCTOS
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id)
    on delete cascade,
  image_url text not null,
  alt_text text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. ACTIVAR SEGURIDAD
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

-- 5. LIMITAR PRIVILEGIOS DE API
revoke all on table
  public.categories,
  public.products,
  public.product_images
from anon, authenticated;

grant select on table
  public.categories,
  public.products,
  public.product_images
to anon, authenticated;

-- 6. POLÍTICAS DE LECTURA PÚBLICA
create policy "Public can read visible categories"
on public.categories
for select
to anon, authenticated
using (is_visible = true);

create policy "Public can read published products"
on public.products
for select
to anon, authenticated
using (is_published = true);

create policy "Public can read published product images"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_published = true
  )
);

-- 7. ÍNDICES PARA CONSULTAS FRECUENTES
create index idx_products_category
on public.products(category_id);

create index idx_products_published_date
on public.products(is_published, created_at desc);

create index idx_product_images_order
on public.product_images(product_id, position);
