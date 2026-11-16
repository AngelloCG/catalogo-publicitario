
-- ETAPA 8: AUTORIZACIÓN ADMINISTRATIVA

-- 1. Tabla de administradores autorizados
create table public.admin_users (
  user_id uuid primary key
    references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users
enable row level security;

-- Solo permitimos consultar la propia autorización.
-- La asignación de administradores se hará desde
-- el SQL Editor, no desde el navegador.
revoke all on public.admin_users
from anon, authenticated;

grant select on public.admin_users
to authenticated;

create policy "Users can read own admin membership"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));


-- 2. Función privada para verificar administradores
-- No se expone mediante la API pública.

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin()
from public;

grant usage on schema private
to authenticated;

grant execute on function private.is_admin()
to authenticated;


-- 3. Permisos para usuarios autenticados
-- RLS decidirá cuáles pueden escribir.

grant insert, update, delete
on public.categories,
   public.products,
   public.product_images
to authenticated;


-- 4. Los administradores pueden leer borradores
-- y categorías ocultas.

create policy "Admins can read all categories"
on public.categories
for select
to authenticated
using ((select private.is_admin()));

create policy "Admins can read all products"
on public.products
for select
to authenticated
using ((select private.is_admin()));

create policy "Admins can read all product images"
on public.product_images
for select
to authenticated
using ((select private.is_admin()));


-- 5. Administrar categorías

create policy "Admins can insert categories"
on public.categories
for insert
to authenticated
with check ((select private.is_admin()));

create policy "Admins can update categories"
on public.categories
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete categories"
on public.categories
for delete
to authenticated
using ((select private.is_admin()));


-- 6. Administrar productos

create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check ((select private.is_admin()));

create policy "Admins can update products"
on public.products
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete products"
on public.products
for delete
to authenticated
using ((select private.is_admin()));


-- 7. Administrar fotografías

create policy "Admins can insert product images"
on public.product_images
for insert
to authenticated
with check ((select private.is_admin()));

create policy "Admins can update product images"
on public.product_images
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can delete product images"
on public.product_images
for delete
to authenticated
using ((select private.is_admin()));
