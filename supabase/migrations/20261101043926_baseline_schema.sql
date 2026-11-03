-- Baseline of Everest V2 (project gnnqwuwaojttcwfzdrko), rebuilt from the live catalog on 2026-11-02.
-- Schema only. No data. The temporary http extension is left out on purpose.

create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create table public.admins (
  id uuid primary key references auth.users(id),
  email text not null unique,
  created_at timestamptz default now(),
  role text
);

create table public.categories (
  id text primary key default extensions.uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

create table public.products (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  category_id text references public.categories(id),
  description text,
  long_description text,
  image_url text,
  price_range text,
  specifications jsonb default '{}'::jsonb,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  image_url text not null,
  alt_text text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table public.services (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  description text,
  icon text,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

create table public.testimonials (
  id uuid primary key default extensions.uuid_generate_v4(),
  author_name text not null,
  author_company text,
  author_role text,
  content text not null,
  rating integer default 5,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

create table public.gallery_images (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text,
  image_url text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

create table public.inquiries (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null,
  company text,
  phone text,
  email text not null,
  category_id text references public.categories(id),
  message text not null,
  is_read boolean default false,
  created_at timestamptz default timezone('utc', now())
);

create table public.site_settings (
  id uuid primary key default extensions.uuid_generate_v4(),
  company_name text default 'Everest Hydro Pneumatic Solutions',
  tagline text,
  logo_url text,
  primary_color text default '#003366',
  secondary_color text default '#333333',
  accent_color text default '#FF6B35',
  phone text,
  email text,
  address text,
  whatsapp text,
  working_hours text,
  google_maps_embed text,
  about_text text,
  mission text,
  vision text,
  updated_at timestamptz default timezone('utc', now()),
  gst_number text,
  company_name_color text default '#111827',
  background_color text default '#ffffff'
);

create table public.pages (
  id uuid primary key default extensions.uuid_generate_v4(),
  label text not null,
  path text not null,
  is_enabled boolean default true,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $$
begin
  return exists (select 1 from public.admins where id = auth.uid());
end;
$$;

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_images enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;

create policy "Admins can view own admin status" on public.admins for select to authenticated using (auth.uid() = id);
create policy "Admins can read own row" on public.admins for select to authenticated using (auth.uid() = id);

create policy "Public can view categories" on public.categories for select to anon, authenticated using (true);
create policy "Admins can manage categories" on public.categories for all to authenticated using (is_admin());
create policy "Public can view products" on public.products for select to anon, authenticated using (true);
create policy "Admins can manage products" on public.products for all to authenticated using (is_admin());
create policy "Public can read product images" on public.product_images for select to anon, authenticated using (true);
create policy "Admins can manage product images" on public.product_images for all to authenticated
  using (exists (select 1 from public.admins where admins.id = auth.uid()))
  with check (exists (select 1 from public.admins where admins.id = auth.uid()));
create policy "Public can view services" on public.services for select to anon, authenticated using (true);
create policy "Admins can manage services" on public.services for all to authenticated using (is_admin());
create policy "Public can view testimonials" on public.testimonials for select to anon, authenticated using (true);
create policy "Admins can manage testimonials" on public.testimonials for all to authenticated using (is_admin());
create policy "Public can view gallery images" on public.gallery_images for select to anon, authenticated using (true);
create policy "Admins can manage gallery images" on public.gallery_images for all to authenticated using (is_admin());
create policy "Public can submit inquiries" on public.inquiries for insert to anon, authenticated with check (true);
create policy "Admins can manage inquiries" on public.inquiries for all to authenticated using (is_admin());
create policy "Public can view site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins can manage site settings" on public.site_settings for all to authenticated using (is_admin());
create policy "Allow public read access" on public.pages for select to public using (true);
create policy "Allow admin full access" on public.pages for all to public using (auth.uid() in (select admins.id from public.admins));

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('Product Images', 'Product Images', true) on conflict (id) do nothing;
create policy "Public Access" on storage.objects for select to public using (bucket_id = 'Product Images');
create policy "Authenticated Upload" on storage.objects for insert to authenticated with check (bucket_id = 'Product Images');
create policy "Authenticated Delete" on storage.objects for delete to authenticated using (bucket_id = 'Product Images');
