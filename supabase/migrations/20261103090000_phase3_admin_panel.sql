-- Phase 3 admin panel, as applied to Everest V2 on 2026-11-03 (in several small steps).
-- Additive only. Removals are logged by log_removal(), called from the admin panel,
-- because the Supabase connector declines statements that create delete triggers.

-- 1. Main categories (the tiles on home and /products)
create table if not exists public.category_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.category_groups enable row level security;
create policy "Public can view category groups" on public.category_groups
  for select to anon, authenticated using (true);
create policy "Admins can manage category groups" on public.category_groups
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.categories
  add column if not exists group_id uuid references public.category_groups(id),
  add column if not exists short_name text,
  add column if not exists is_active boolean not null default true;

-- 2. Company details and ratings
alter table public.site_settings
  add column if not exists established_year integer,
  add column if not exists google_rating text,
  add column if not exists google_reviews text,
  add column if not exists indiamart_rating text,
  add column if not exists indiamart_reviews text;

-- 3. Gallery photos open a page on the site
alter table public.gallery_images add column if not exists link_url text;

-- 4. Admins may see the admin list
create policy "Admins can view admins" on public.admins
  for select to authenticated using (public.is_admin());

-- 5. Change log and publish log
create table if not exists public.change_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  row_id text,
  action text not null,
  summary text,
  actor_email text,
  created_at timestamptz not null default now()
);
alter table public.change_log enable row level security;
create policy "Admins can view change log" on public.change_log
  for select to authenticated using (public.is_admin());

create table if not exists public.site_publishes (
  id bigint generated always as identity primary key,
  requested_by text,
  status text not null,
  message text,
  created_at timestamptz not null default now()
);
alter table public.site_publishes enable row level security;
create policy "Admins can view publishes" on public.site_publishes
  for select to authenticated using (public.is_admin());

create or replace function public.log_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  j jsonb;
begin
  if tg_op = 'INSERT' or tg_op = 'UPDATE' then j := to_jsonb(new); else j := to_jsonb(old); end if;
  insert into public.change_log (table_name, row_id, action, summary, actor_email)
  values (
    tg_table_name,
    coalesce(j->>'id', j->>'product_id'),
    lower(tg_op),
    left(coalesce(j->>'name', j->>'title', j->>'label', j->>'author_name', j->>'alt_text',
                  j->>'price_display', j->>'company_name'), 120),
    auth.jwt()->>'email'
  );
  return null;
end;
$$;

create or replace trigger log_change after insert or update on public.products for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.categories for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.category_groups for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.product_images for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.product_prices for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.product_media for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.services for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.testimonials for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.site_settings for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.pages for each row execute function public.log_change();
create or replace trigger log_change after insert or update on public.gallery_images for each row execute function public.log_change();

create or replace function public.log_removal(p_table text, p_row_id text, p_summary text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only';
  end if;
  insert into public.change_log (table_name, row_id, action, summary, actor_email)
  values (left(p_table, 60), left(p_row_id, 80), 'remove', left(p_summary, 120), auth.jwt()->>'email');
end;
$$;

-- 6. Data set-up (run once): the 7 proposed main categories, range order and chip names,
-- clean company details from docs/content/verified-facts.md, and Dealers and Reviews in the menu.
insert into public.category_groups (name, image_url, sort_order)
select v.name, case when v.img is null then null
  else 'https://gnnqwuwaojttcwfzdrko.supabase.co/storage/v1/object/public/Product%20Images/' || v.img end, v.n
from (values
  ('Silent air compressors', null, 10), ('Pallet trucks', 'pallet-107.webp', 20),
  ('Stackers and lifting tables', 'estacker-024.webp', 30), ('Dental and lab compressors', null, 40),
  ('Screw air compressors', null, 50), ('Reciprocating compressors', null, 60), ('Compressor motors', null, 70)
) v(name, img, n)
where not exists (select 1 from public.category_groups g where g.name = v.name);

update public.categories c set group_id = g.id, sort_order = v.n, short_name = coalesce(c.short_name, v.short)
from (values
  ('oil-free-silent-air-compressors','Silent air compressors',10,null),
  ('hydraulic-hand-pallet-trucks','Pallet trucks',20,'Hand'),
  ('pallet-trucks-with-weighing-scale','Pallet trucks',21,'With weighing scale'),
  ('semi-electric-pallet-trucks','Pallet trucks',22,'Semi electric'),
  ('electric-stackers','Stackers and lifting tables',30,'Electric stackers'),
  ('semi-electric-stackers','Stackers and lifting tables',31,'Semi electric stackers'),
  ('manual-stackers','Stackers and lifting tables',32,'Manual stackers'),
  ('hydraulic-lifting-tables','Stackers and lifting tables',33,'Lifting tables'),
  ('dental-lab-air-compressors','Dental and lab compressors',40,null),
  ('screw-air-compressors','Screw air compressors',50,null),
  ('belt-driven-reciprocating-compressors','Reciprocating compressors',60,'Belt driven'),
  ('air-receivers','Reciprocating compressors',61,'Air receivers'),
  ('oil-free-compressor-motors','Compressor motors',70,null)
) v(slug, grp, n, short)
join public.category_groups g on g.name = v.grp
where c.slug = v.slug;

update public.site_settings set
  company_name = 'Everest Hydro Pneumatic Solutions',
  phone = '+91 88558 20105',
  whatsapp = '918855820105',
  address = 'PAP G-64, Ajantha Nagar, Kasturi Market, Chikhali Akurdi Rd, Thermax Chauk, Pimpri-Chinchwad, Maharashtra 411019',
  working_hours = 'Mon to Sat, 9:00 AM to 6:30 PM',
  established_year = 2020, google_rating = '5.0', google_reviews = '39', indiamart_rating = '4.9', indiamart_reviews = 'about 40'
where id is not null;

update public.pages set is_enabled = false where path = '/';
insert into public.pages (label, path, is_enabled, sort_order)
select v.label, v.path, true, v.n
from (values ('Dealers', '/dealers', 35), ('Reviews', '/reviews', 38)) v(label, path, n)
where not exists (select 1 from public.pages p where p.path = v.path);

-- 7. Only triggers run log_change; only signed-in admins can use log_removal.
revoke execute on function public.log_change() from public, anon, authenticated;
revoke execute on function public.log_removal(text, text, text) from public, anon;

-- 8. Ranges removed (applied the same day): the 13 ranges were merged into the 7 categories.
-- Products were re-pointed to the surviving category rows (general, pallet, electricstacker, dental, oilfree, belt, motor),
-- the survivors renamed and given new slugs, the pallet film attached to the 6 hand pallet trucks, and the 6 empty
-- ranges deleted with the service key. category_groups, categories.group_id and categories.short_name are now unused.
