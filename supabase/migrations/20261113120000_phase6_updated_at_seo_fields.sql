-- Phase 6: real "last changed" dates (sitemap lastmod) and optional SEO fields per product.
-- Applied by the owner in the Supabase SQL Editor on 2026-11-13.

alter table public.products add column if not exists updated_at timestamptz not null default now();
alter table public.categories add column if not exists updated_at timestamptz not null default now();
alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists seo_description text;
alter table public.products add column if not exists faq jsonb not null default '[]'::jsonb;

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
drop trigger if exists categories_touch on public.categories;
create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();

-- A photo change counts as a product change.
create or replace function public.touch_product_from_image() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.products set updated_at = now() where id = coalesce(new.product_id, old.product_id);
  return null;
end $$;
revoke execute on function public.touch_product_from_image() from public, anon, authenticated;

drop trigger if exists product_images_touch on public.product_images;
create trigger product_images_touch after insert or update or delete on public.product_images
  for each row execute function public.touch_product_from_image();
