-- Phase 3, part 1: only adds things. Old rules are replaced in part 2.

-- CATALOGUE. Hide without deleting.
alter table public.products add column is_active boolean not null default true;

-- PRICES. Admins only. The public gets allowed prices through public_prices() and nothing else.
create table public.product_prices (
  product_id uuid primary key references public.products(id) on delete cascade,
  price_display text,
  show_price boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.product_prices enable row level security;
create policy "Admins can manage prices" on public.product_prices
  for all to authenticated using (is_admin()) with check (is_admin());

alter table public.site_settings add column show_prices boolean not null default false;

create or replace function public.public_prices()
returns table (product_id uuid, price_display text)
language sql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
  select pp.product_id, pp.price_display
  from public.product_prices pp
  join public.products p on p.id = pp.product_id
  where pp.show_price
    and p.is_active
    and coalesce(pp.price_display, '') <> ''
    and exists (select 1 from public.site_settings s where s.show_prices);
$$;

revoke all on function public.public_prices() from public;
grant execute on function public.public_prices() to anon, authenticated;

-- Clean range slugs and display order. No live URL uses these: /categories is a new route.
update public.categories c set slug = v.slug, sort_order = v.ord
from (values
  ('Oil_Free_Silent_Air_Compressor', 'oil-free-silent-air-compressors', 1),
  ('Hydraulic_Hand_Pallet_Truck', 'hydraulic-hand-pallet-trucks', 2),
  ('Hand_Pallet_Truck_With_Weighing_Scale/Meter', 'pallet-trucks-with-weighing-scale', 3),
  ('Dental_Lab_Oil_free_Air_Compressor', 'dental-lab-air-compressors', 4),
  ('Oil_Free_Compressor_Motor', 'oil-free-compressor-motors', 5),
  ('Screw_Air_Compressor', 'screw-air-compressors', 6),
  ('Belt_Driven_Reciprocating_Air_Compressor', 'belt-driven-reciprocating-compressors', 7),
  ('Air_Receiver', 'air-receivers', 8),
  ('Hydraulic_Material_Lifting_Table', 'hydraulic-lifting-tables', 9),
  ('Manual_Fork_Stacker', 'manual-stackers', 10),
  ('Semi_Electric_Stacker', 'semi-electric-stackers', 11),
  ('Electric_Stacker', 'electric-stackers', 12),
  ('Semi_Electric_Pallet_Truck', 'semi-electric-pallet-trucks', 13)
) as v(old_slug, slug, ord)
where c.slug = v.old_slug;

-- REVIEWS. The site shows only rows with a source, so the 4 old rows stay unused.
alter table public.testimonials
  add column source text,
  add column source_url text,
  add column product_mentioned text,
  add column review_date date;

insert into public.testimonials (author_name, author_company, content, source, source_url, product_mentioned, sort_order)
select v.* from (values
  ('Engineers', 'Pune', 'Quick Response, Reasonable Rate, Good in After Sales Service, Good negotiation skill, Polite in nature.', 'IndiaMART', 'https://www.everesthps.in/testimonial.html', 'Air Compressor', 1),
  ('New Way Typesetters And Processors', 'Pune', 'I would recommend this service team for future maintenance needs.', 'IndiaMART', 'https://www.everesthps.in/testimonial.html', 'Oil Free Air Compressor', 2),
  ('KULDIP Enterprises Chakan', 'Pune', 'Recommended based on quality, functionality, and customer support', 'IndiaMART', 'https://www.everesthps.in/testimonial.html', 'Portable Air Compressor', 3),
  ('Bhaskar Chandrakant Shingote', 'Pune', 'Good productivity & service. Commited team.', 'IndiaMART', 'https://www.everesthps.in/testimonial.html', 'Air Compressor', 4),
  ('Yogesh Dhamale', 'Pune', 'Very nice service and best product I got Thank you', 'IndiaMART', 'https://www.everesthps.in/testimonial.html', 'Reciprocating Air Compressor', 5),
  ('Rajnikant Bhosale', 'Pune', 'Good and fast service', 'IndiaMART', 'https://www.everesthps.in/testimonial.html', 'Pallet Truck', 6)
) as v(author_name, author_company, content, source, source_url, product_mentioned, sort_order);

-- FILMS. Paths are relative to the site, see docs/ops/film-hosting.md.
create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  category_id text references public.categories(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  video_url text not null,
  video_url_small text,
  poster_url text,
  alt_text text,
  created_at timestamptz not null default now(),
  constraint product_media_one_target check ((category_id is null) <> (product_id is null))
);
alter table public.product_media enable row level security;
create policy "Public can view product media" on public.product_media
  for select to anon, authenticated using (true);
create policy "Admins can manage product media" on public.product_media
  for all to authenticated using (is_admin()) with check (is_admin());

insert into public.product_media (category_id, video_url, video_url_small, poster_url, alt_text)
select c.id, '/films/everest-' || v.film || '-1080.mp4', '/films/everest-' || v.film || '-720.mp4', '/films/everest-' || v.film || '-poster.jpg', v.alt
from public.categories c
join (values
  ('oil-free-silent-air-compressors', 'compressor', 'Film of the Everest portable oil-free compressor'),
  ('hydraulic-hand-pallet-trucks', 'pallet', 'Film of the Everest hand pallet truck lifting its forks'),
  ('pallet-trucks-with-weighing-scale', 'scale', 'Film of the Everest pallet truck with weighing scale'),
  ('dental-lab-air-compressors', 'dental', 'Film of the Everest dental air compressor'),
  ('oil-free-compressor-motors', 'motor', 'Film of the Everest oil-free compressor motor'),
  ('screw-air-compressors', 'screw', 'Film showing how a screw compressor works')
) as v(slug, film, alt) on c.slug = v.slug;
