-- CannaBuddyHub database. Safe to run more than once.
-- Content (products, slides, brands, settings) is public to read and only the admin can change it.
-- Shoppers can add sign-ups, cart activity and orders; only the admin can read them.

-- ---- admin ------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

-- lets the login screen accept a username as well as an email, like WordPress
create or replace function public.admin_login_email(p_username text) returns text
language sql stable security definer set search_path = '' as $$
  select u.email from public.admins a join auth.users u on u.id = a.user_id where lower(a.username) = lower(trim(p_username)) limit 1
$$;

drop policy if exists "admins read" on public.admins;
create policy "admins read" on public.admins for select to authenticated using (public.is_admin());
drop policy if exists "admins rename self" on public.admins;
create policy "admins rename self" on public.admins for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- content ----------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['products', 'slides', 'brands'] loop
    execute format('create table if not exists public.%I (
      id text primary key,
      position integer not null default 0,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )', t);
    execute format('create index if not exists %I on public.%I (position)', t || '_position_idx', t);
  end loop;
end $$;

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['products', 'slides', 'brands', 'settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ---- from shoppers ----------------------------------------------------------
create table if not exists public.subscribers (
  email text primary key check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  created_at timestamptz not null default now()
);

create table if not exists public.cart_events (
  id bigint generated always as identity primary key,
  product_id text not null check (char_length(product_id) <= 64),
  name text check (char_length(name) <= 300),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  customer jsonb not null check (octet_length(customer::text) <= 4000),
  items jsonb not null check (octet_length(items::text) <= 20000),
  total numeric(10, 2),
  payment text check (char_length(payment) <= 60),
  status text not null default 'new' check (status in ('new', 'paid', 'completed', 'cancelled'))
);
create index if not exists orders_created_idx on public.orders (created_at desc);

do $$
declare t text;
begin
  foreach t in array array['subscribers', 'cart_events', 'orders'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "shopper insert" on public.%I', t);
    execute format('drop policy if exists "admin read" on public.%I', t);
    execute format('create policy "admin read" on public.%I for select to authenticated using (public.is_admin())', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
    execute format('grant insert on public.%I to anon, authenticated', t);
    execute format('grant select, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
create policy "shopper insert" on public.subscribers for insert to anon, authenticated with check (true);
create policy "shopper insert" on public.cart_events for insert to anon, authenticated with check (true);
-- new orders only; status changes are the admin's
create policy "shopper insert" on public.orders for insert to anon, authenticated with check (status = 'new');

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.admin_login_email(text) to anon, authenticated;
grant select, update on public.admins to authenticated;

-- ---- live updates -----------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['products', 'slides', 'brands', 'settings', 'subscribers', 'cart_events', 'orders'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ---- photos -----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media admin read" on storage.objects;
create policy "media admin read" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
