-- Phase 3, part 2: replaces old rules. The Supabase connector declines these drop lines,
-- so the owner runs this file in the Supabase SQL Editor on Everest V2.
-- Run after part 1.

-- Public policies test is_active only. Admins see hidden rows through their "manage" policies.
-- Do not add is_admin() to these: anon cannot run it, so a hidden row would fail the whole query.
drop policy "Public can view products" on public.products;
create policy "Public can view active products" on public.products
  for select to anon, authenticated using (is_active);

drop policy "Public can read product images" on public.product_images;
create policy "Public can read active product images" on public.product_images
  for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));

drop policy "Public can view testimonials" on public.testimonials;
create policy "Public can view active testimonials" on public.testimonials
  for select to anon, authenticated using (is_active);

-- SECURITY.
-- Leads go to Salesforce, so the public has no reason to write here.
drop policy "Public can submit inquiries" on public.inquiries;

-- pages used a policy open to every role.
drop policy "Allow admin full access" on public.pages;
create policy "Admins can manage pages" on public.pages
  for all to authenticated using (is_admin()) with check (is_admin());

-- Same check existed twice.
drop policy "Admins can view own admin status" on public.admins;

-- is_admin() is for signed-in users only.
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Any signed-in user could upload or delete. Limit that to admins.
drop policy "Authenticated Upload" on storage.objects;
drop policy "Authenticated Delete" on storage.objects;
create policy "Admins can upload product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'Product Images' and public.is_admin());
create policy "Admins can update product images" on storage.objects for update to authenticated
  using (bucket_id = 'Product Images' and public.is_admin());
create policy "Admins can delete product images" on storage.objects for delete to authenticated
  using (bucket_id = 'Product Images' and public.is_admin());
