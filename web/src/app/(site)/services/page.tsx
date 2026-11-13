import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ContactPanel, PageHero } from "@/components/ui";
import { servicePages } from "@/lib/service-pages";

export const metadata: Metadata = pageMeta({ title: "Services", description: "Air compressor repair and on-site servicing, installation, spare parts, second-hand compressors, and compressors, pallet trucks and stackers on rent.", path: "/services" });

// Cards come from lib/service-pages.ts, each with its own page. Sales links to the catalogue.
const cards = [
  { href: "/products", name: "Sales and supply", text: "Compressors, pallet trucks, stackers and lifting tables for dealers and end users." },
  ...servicePages.map((s) => ({ href: `/services/${s.slug}`, name: s.name, text: s.answer.split(". ")[0] + "." })),
  { href: "/services/areas-served", name: "Areas we serve", text: "Pimpri-Chinchwad, Pune and across Maharashtra." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page">
        <PageHero
          kicker="What we do"
          title="Services"
          intro="Sales, on-site repair and servicing, installation, spare parts, second-hand compressors and equipment on rent."
          actions={<Link prefetch={false} href="/contact" className="btn btn-primary">Talk to us</Link>}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <li key={card.href}>
              <Link
                prefetch={false}
                href={card.href}
                className="tile group relative flex h-full min-h-[170px] flex-col rounded-card bg-surface p-6 md:p-7"
              >
                <span className="display tabular text-[15px] font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="display card-title mt-3">{card.name}</h2>
                <p className="mt-2 text-muted">{card.text}</p>
                <span className="mt-auto pt-5 text-[15px] font-semibold group-hover:text-brand">Read more →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ContactPanel />
    </>
  );
}
