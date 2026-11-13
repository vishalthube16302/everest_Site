import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ContactPanel, FaqList, PageHero } from "@/components/ui";
import { getSite } from "@/lib/data";
import { breadcrumbJsonLd, faqJsonLd, pageMeta, serviceJsonLd } from "@/lib/seo";
import { serviceAreas, servicePages } from "@/lib/service-pages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = servicePages.find((p) => p.slug === slug);
  if (!s) return {};
  return pageMeta({ title: s.title, description: s.description, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = servicePages.find((p) => p.slug === slug);
  if (!s) notFound();
  const site = await getSite();
  const path = `/services/${s.slug}`;
  const wa = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(s.whatsapp)}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.name, path },
          ]),
          serviceJsonLd({ name: s.title, serviceType: s.serviceType, description: s.description, path }, serviceAreas, site),
          faqJsonLd(s.faq),
        ]}
      />
      <section className="page">
        <p className="pt-3 text-[15px] text-muted">
          <Link prefetch={false} href="/services" className="inline-block py-2 hover:text-brand">Services</Link> / {s.name}
        </p>
        <PageHero
          kicker="Service"
          title={s.title}
          intro={s.answer}
          actions={
            <>
              <a href={wa} className="btn btn-primary">WhatsApp us</a>
              <a href={site.phoneHref} className="btn btn-outline tabular">{site.phoneDisplay}</a>
            </>
          }
        />

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {s.points.map((p) => (
            <li key={p.title} className="rounded-card bg-surface p-6 md:p-7">
              <h2 className="display card-title">{p.title}</h2>
              <p className="mt-2 text-muted">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="on-ink rounded-card bg-ink p-6 text-white md:p-8">
            <h2 className="display card-title">For a quick quote, tell us</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-on-dark">
              {s.ask.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
            <p className="mt-5 text-muted-on-dark">{site.hours}. We reply within 24 hours.</p>
          </div>
          <div className="rounded-card bg-surface p-6 md:p-8">
            <h2 className="display card-title">Related</h2>
            <ul className="mt-3">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link prefetch={false} href={l.href} className="inline-block py-2 font-semibold hover:text-brand">{l.label} →</Link>
                </li>
              ))}
              <li>
                <Link prefetch={false} href="/services/areas-served" className="inline-block py-2 font-semibold hover:text-brand">Areas we serve →</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="page section">
        <h2 className="display section-title mb-6">Questions.</h2>
        <FaqList faq={s.faq} />
      </section>
      <ContactPanel />
    </>
  );
}
