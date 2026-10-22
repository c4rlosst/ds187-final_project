-- Nourio schema.
-- Run this first in the Supabase SQL editor, then run seed.sql.
-- Safe to re-run: tables are only created if missing and policies are recreated.

create table if not exists public.ingredients (
  id bigint generated always as identity primary key,
  name text not null unique
);

create table if not exists public.recipes (
  id bigint generated always as identity primary key,
  title text not null unique,
  description text,
  prep_minutes integer check (prep_minutes > 0),
  servings integer check (servings > 0),
  -- Approximate nutrition values per serving.
  calories integer check (calories >= 0),
  protein_g numeric(6, 1) check (protein_g >= 0),
  carbs_g numeric(6, 1) check (carbs_g >= 0),
  fat_g numeric(6, 1) check (fat_g >= 0),
  fiber_g numeric(6, 1) check (fiber_g >= 0),
  steps text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_ingredients (
  recipe_id bigint not null references public.recipes (id) on delete cascade,
  ingredient_id bigint not null references public.ingredients (id) on delete restrict,
  quantity text,
  primary key (recipe_id, ingredient_id)
);

create index if not exists recipe_ingredients_ingredient_id_idx
  on public.recipe_ingredients (ingredient_id);

-- Food places that visitors log on the map.
create table if not exists public.places (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  category text not null default 'other'
    check (category in ('restaurant', 'cafe', 'grocery', 'market', 'other')),
  description text check (char_length(description) <= 500),
  address text check (char_length(address) <= 300),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  created_at timestamptz not null default now()
);

-- Row level security: everyone can read everything. Recipes and ingredients are
-- read-only from the app. Anyone can log a new place, but nobody can edit or
-- delete places from the app (do that in the Supabase dashboard).
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.places enable row level security;

drop policy if exists "ingredients are public" on public.ingredients;
create policy "ingredients are public" on public.ingredients
  for select to anon, authenticated using (true);

drop policy if exists "recipes are public" on public.recipes;
create policy "recipes are public" on public.recipes
  for select to anon, authenticated using (true);

drop policy if exists "recipe ingredients are public" on public.recipe_ingredients;
create policy "recipe ingredients are public" on public.recipe_ingredients
  for select to anon, authenticated using (true);

drop policy if exists "places are public" on public.places;
create policy "places are public" on public.places
  for select to anon, authenticated using (true);

drop policy if exists "anyone can log a place" on public.places;
create policy "anyone can log a place" on public.places
  for insert to anon, authenticated
  with check (char_length(name) between 1 and 100);

-- Table privileges for the Data API roles.
grant select on public.ingredients, public.recipes, public.recipe_ingredients, public.places
  to anon, authenticated;
grant insert on public.places to anon, authenticated;
