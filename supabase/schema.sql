-- ============================================
--  Таблица товаров для магазина
--  Запускается один раз в Supabase → SQL Editor
-- ============================================

create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  price      numeric not null,
  image      text,
  category   text,
  created_at timestamptz not null default now()
);

-- Включаем защиту на уровне строк (Row Level Security)
alter table public.products enable row level security;

-- Разрешаем ВСЕМ только читать каталог (магазин публичный).
-- Запись будет идти только с сервера через service_role-ключ,
-- который игнорирует RLS — поэтому отдельная политика на вставку не нужна.
create policy "Public can read products"
  on public.products
  for select
  using (true);

-- (необязательно) переносим те 2 товара, что были захардкожены в коде
insert into public.products (title, price, image, category) values
  ('iPhone 11', 12000, '/iphone.jpeg', 'phones'),
  ('Samsung TV', 8000,  '/tv.jpg',     'tv');
