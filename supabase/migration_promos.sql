-- Tinta — agrega la tabla de promos (2x1, 3x1, 4x1 por tamaño)
-- Pegar y ejecutar en: Supabase → SQL Editor → New query.

create table if not exists public.promos (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  tipo        text not null check (tipo in ('2x1', '3x1', '4x1')),
  tamano      text not null check (tamano in ('pequeno', 'mediano', 'grande', 'sesion')),
  precio      integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists promos_profile_id_idx on public.promos (profile_id);

alter table public.promos enable row level security;

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
