-- Tinta — agrega el campo "barrio" al perfil
-- Pegar y ejecutar en: Supabase → SQL Editor → New query.

alter table public.profiles add column if not exists barrio text;
