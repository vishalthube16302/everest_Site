-- The site must carry no Chakan wording (docs/content/verified-facts.md). One reviewer's company name had it.
update public.testimonials set author_name = 'KULDIP Enterprises' where author_name = 'KULDIP Enterprises Chakan';
