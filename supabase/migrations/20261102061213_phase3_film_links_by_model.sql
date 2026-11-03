-- These three films show numbers for one model, so they link to that model, not the whole range.
update public.product_media m
set category_id = null, product_id = p.id
from public.products p
join (values
  ('/films/everest-compressor-1080.mp4', '2-hp-50l-portable-oil-free-silent-air-compressor'),
  ('/films/everest-dental-1080.mp4', '0-75hp-30l-dental-oil-free-air-compressor'),
  ('/films/everest-scale-1080.mp4', '3-ton-685-hydraulic-pallet-truck-with-weight-scale')
) as v(video_url, slug) on p.slug = v.slug
where m.video_url = v.video_url;
