import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ContactPanel, PageHero } from "@/components/ui";
import { glossary, guides } from "@/lib/guides";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Air compressor and pallet truck guides",
  description: "Plain guides from Everest, Pune: compressor sizing, oil-free vs oil, maintenance, why a compressor will not start, choosing a pallet truck, and a glossary.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "Air compressor and material handling glossary",
            hasDefinedTerm: glossary.map((g) => ({ "@type": "DefinedTerm", name: g.term, description: g.text })),
          },
        ]}
      />
      <section className="page">
        <PageHero kicker="Guides" title="Guides and answers" intro="Short, plain answers to what people ask before they buy, use or repair a compressor or pallet truck." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link prefetch={false} href={`/guides/${g.slug}`} className="tile group flex h-full flex-col rounded-card bg-surface p-6 md:p-7">
                <h2 className="display card-title">{g.title}</h2>
                <p className="mt-2 text-muted">{g.answer.split(". ")[0]}.</p>
                <span className="mt-auto pt-5 text-[15px] font-semibold group-hover:text-brand">Read →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section id="glossary" className="page section scroll-mt-4">
        <h2 className="display section-title mb-6">Glossary.</h2>
        <dl className="grid gap-x-8 rounded-card bg-surface p-6 md:grid-cols-2 md:p-8">
          {glossary.map((g) => (
            <div key={g.term} className="border-b border-line py-4">
              <dt className="font-semibold">{g.term}</dt>
              <dd className="mt-1 text-muted">{g.text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <ContactPanel />
    </>
  );
}
