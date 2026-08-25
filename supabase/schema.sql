-- Tinta — schema de Supabase
-- Pegar y ejecutar completo en: Supabase → SQL Editor → New query.
-- Es seguro volver a correrlo (usa IF NOT EXISTS / OR REPLACE donde aplica).

-- ============================================================
-- 1. Tablas
-- ============================================================

create table if not exists public.profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid unique references auth.users(id) on delete cascade,
  slug                text unique not null,
  nombre              text not null default '',
  ciudad              text not null default '',
  estudio             text not null default '',
  bio                 text not null default '',
  foto_url            text,
  estilos             text[] not null default '{}',
  experiencia         integer not null default 0,
  contacto_instagram  text,
  contacto_whatsapp   text,
  contacto_email      text,
  contacto_web        text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.precios (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  tamano      text not null check (tamano in ('pequeno', 'mediano', 'grande', 'sesion')),
  desde       integer not null default 0,
  hasta       integer not null default 0,
  unique (profile_id, tamano)
);

create table if not exists public.trabajos (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  titulo      text not null default '',
  estilo      text not null default '',
  imagen_url  text not null,
  orden       integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.promos (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  tipo        text not null check (tipo in ('2x1', '3x1', '4x1')),
  tamano      text not null check (tamano in ('pequeno', 'mediano', 'grande', 'sesion')),
  precio      integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists profiles_estilos_idx on public.profiles using gin (estilos);
create index if not exists precios_profile_id_idx on public.precios (profile_id);
create index if not exists trabajos_profile_id_idx on public.trabajos (profile_id);
create index if not exists promos_profile_id_idx on public.promos (profile_id);

-- updated_at automático en profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.precios enable row level security;
alter table public.trabajos enable row level security;
alter table public.promos enable row level security;

drop policy if exists "profiles publicos" on public.profiles;
create policy "profiles publicos" on public.profiles
  for select using (true);

drop policy if exists "profiles insert propio" on public.profiles;
create policy "profiles insert propio" on public.profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "profiles update propio" on public.profiles;
create policy "profiles update propio" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "profiles delete propio" on public.profiles;
create policy "profiles delete propio" on public.profiles
  for delete using (auth.uid() = user_id);

drop policy if exists "precios publicos" on public.precios;
create policy "precios publicos" on public.precios
  for select using (true);

drop policy if exists "precios insert propio" on public.precios;
create policy "precios insert propio" on public.precios
  for insert with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "precios update propio" on public.precios;
create policy "precios update propio" on public.precios
  for update using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  ) with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "precios delete propio" on public.precios;
create policy "precios delete propio" on public.precios
  for delete using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "trabajos publicos" on public.trabajos;
create policy "trabajos publicos" on public.trabajos
  for select using (true);

drop policy if exists "trabajos insert propio" on public.trabajos;
create policy "trabajos insert propio" on public.trabajos
  for insert with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "trabajos update propio" on public.trabajos;
create policy "trabajos update propio" on public.trabajos
  for update using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  ) with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "trabajos delete propio" on public.trabajos;
create policy "trabajos delete propio" on public.trabajos
  for delete using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "promos publicos" on public.promos;
create policy "promos publicos" on public.promos
  for select using (true);

drop policy if exists "promos insert propio" on public.promos;
create policy "promos insert propio" on public.promos
  for insert with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "promos update propio" on public.promos;
create policy "promos update propio" on public.promos
  for update using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  ) with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "promos delete propio" on public.promos;
create policy "promos delete propio" on public.promos
  for delete using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

-- ============================================================
-- 3. Alta automática de perfil al registrarse (Google login)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  nombre_base text;
  slug_base   text;
  slug_final  text;
  sufijo      integer := 1;
begin
  nombre_base := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1)
  );

  -- slugify: minúsculas, sin acentos, espacios/símbolos -> guiones
  slug_base := lower(nombre_base);
  slug_base := translate(
    slug_base,
    'áéíóúñäëïöüàèìòù',
    'aeiounaeiouaeiou'
  );
  slug_base := regexp_replace(slug_base, '[^a-z0-9]+', '-', 'g');
  slug_base := trim(both '-' from slug_base);
  if slug_base = '' then
    slug_base := 'tatuador';
  end if;

  slug_final := slug_base;
  while exists (select 1 from public.profiles where slug = slug_final) loop
    sufijo := sufijo + 1;
    slug_final := slug_base || '-' || sufijo;
  end loop;

  insert into public.profiles (user_id, slug, nombre, foto_url)
  values (
    new.id,
    slug_final,
    nombre_base,
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 4. Storage: buckets públicos + policies de escritura por dueño
-- ============================================================

insert into storage.buckets (id, name, public)
values ('perfil-fotos', 'perfil-fotos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('trabajos-fotos', 'trabajos-fotos', true)
on conflict (id) do nothing;

drop policy if exists "perfil-fotos insert propio" on storage.objects;
create policy "perfil-fotos insert propio" on storage.objects
  for insert with check (
    bucket_id = 'perfil-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "perfil-fotos update propio" on storage.objects;
create policy "perfil-fotos update propio" on storage.objects
  for update using (
    bucket_id = 'perfil-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "perfil-fotos delete propio" on storage.objects;
create policy "perfil-fotos delete propio" on storage.objects
  for delete using (
    bucket_id = 'perfil-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "trabajos-fotos insert propio" on storage.objects;
create policy "trabajos-fotos insert propio" on storage.objects
  for insert with check (
    bucket_id = 'trabajos-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "trabajos-fotos update propio" on storage.objects;
create policy "trabajos-fotos update propio" on storage.objects
  for update using (
    bucket_id = 'trabajos-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "trabajos-fotos delete propio" on storage.objects;
create policy "trabajos-fotos delete propio" on storage.objects
  for delete using (
    bucket_id = 'trabajos-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
