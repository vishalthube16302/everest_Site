import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ContactPanel, FaqList, PageHero } from "@/components/ui";
import { guides } from "@/lib/guides";
import { abs, breadcrumbJsonLd, faqJsonLd, pageMeta, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  return g ? pageMeta({ title: g.title, description: g.description, path: `/guides/${g.slug}` }) : {};
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path }]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: g.title,
            description: g.description,
            url: abs(path),
            author: { "@type": "Organization", name: "Everest Hydro Pneumatic Solutions", url: siteUrl },
            publisher: { "@id": `${siteUrl}/#organization` },
          },
          faqJsonLd(g.faq),
        ]}
      />
      <article>
        <section className="page">
          <p className="pt-3 text-[15px] text-muted">
            <Link prefetch={false} href="/guides" className="inline-block py-2 hover:text-brand">Guides</Link>
          </p>
          <PageHero kicker="Guide" title={g.title} intro={g.answer} />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {g.sections.map((s) => (
              <div key={s.h} className="rounded-card bg-surface p-6 md:p-8">
                <h2 className="display card-title">{s.h}</h2>
                {s.p.map((t) => (
                  <p key={t} className="mt-3 text-muted">{t}</p>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-6 flex flex-wrap gap-x-5">
            {g.links.map((l) => (
              <Link key={l.href} prefetch={false} href={l.href} className="inline-block py-2 font-semibold text-brand hover:underline">{l.label} →</Link>
            ))}
            <Link prefetch={false} href="/guides#glossary" className="inline-block py-2 font-semibold text-brand hover:underline">Glossary →</Link>
          </p>
        </section>
        <section className="page section">
          <h2 className="display section-title mb-6">Questions.</h2>
          <FaqList faq={g.faq} />
        </section>
      </article>
      <ContactPanel />
    </>
  );
}
