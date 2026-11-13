import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ContactPanel, PageHero } from "@/components/ui";
import { getSite } from "@/lib/data";
import { breadcrumbJsonLd, mapsUrl, pageMeta } from "@/lib/seo";
import { serviceAreas, servicePages } from "@/lib/service-pages";

// One page for all areas, not one per city: no thin copies. Areas come from our Google Business Profile.
export const metadata: Metadata = pageMeta({
  title: "Areas we serve in Maharashtra",
  description: "Everest serves Pimpri-Chinchwad, Pune, Mumbai, Nashik, Satara, Solapur, Ahilyanagar and more of Maharashtra with air compressors and pallet trucks.",
  path: "/services/areas-served",
});

export default async function AreasPage() {
  const site = await getSite();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Areas served", path: "/services/areas-served" },
        ])}
      />
      <section className="page">
        <p className="pt-3 text-[15px] text-muted">
          <Link prefetch={false} href="/services" className="inline-block py-2 hover:text-brand">Services</Link> / Areas served
        </p>
        <PageHero
          kicker="Where we work"
          title="Areas we serve in Maharashtra"
          intro={`Everest is based in Pimpri-Chinchwad, Pune, and serves customers across Maharashtra. Call to check we can reach your site for repair, installation or rent.`}
          actions={
            <>
              <a href={site.phoneHref} className="btn btn-primary tabular">{site.phoneDisplay}</a>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-outline">Open in Maps</a>
            </>
          }
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {serviceAreas.map((a) => (
            <li key={a} className="rounded-card bg-surface px-5 py-4 text-lg font-semibold">{a}</li>
          ))}
        </ul>
        <div className="mt-4 rounded-card bg-surface p-6 md:p-8">
          <h2 className="display card-title">Our address</h2>
          <p className="mt-3 text-lg">{site.address}</p>
          <p className="mt-2 text-muted">{site.hours}</p>
        </div>
      </section>
      <section className="page section">
        <h2 className="display section-title mb-6">What we do.</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((s) => (
            <li key={s.slug}>
              <Link prefetch={false} href={`/services/${s.slug}`} className="tile block h-full rounded-card bg-surface p-6 md:p-7">
                <h3 className="display card-title">{s.name}</h3>
                <span className="mt-4 inline-block text-[15px] font-semibold">Read more →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ContactPanel />
    </>
  );
}
