-- The 4 old testimonials have no source and are not confirmed real (docs/content/verified-facts.md).
-- The site never showed them. Now they are switched off in the database too.
update public.testimonials set is_active = false where source is null;
