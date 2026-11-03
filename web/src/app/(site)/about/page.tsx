import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { CategoryTile, ContactPanel, PageHero, Photo, StatBlock } from "@/components/ui";
import { getCategoryTiles, getSite, storageUrl } from "@/lib/data";

export const metadata: Metadata = pageMeta({ title: "About Everest", description: "Everest Hydro Pneumatic Solutions: manufacturer, dealer and supplier of air compressors and material handling equipment in Pimpri-Chinchwad since 2020.", path: "/about" });

export default async function AboutPage() {
  const [site, categories] = await Promise.all([getSite(), getCategoryTiles()]);
  const { ratings } = site;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
  return (
    <>
      <section className="page">
        <PageHero
          kicker="About us"
          title={site.name}
          intro={site.tagline}
          aside={
            <div className="relative overflow-hidden rounded-panel bg-ink p-6 md:p-8">
              <div className="grid grid-cols-2 items-end gap-4">
                <Link prefetch={false} href="/categories/pallet-trucks" className="block">
                  <Photo src={storageUrl("pallet-107.webp")} alt="Everest hand pallet truck" className="h-auto w-full rounded-xl bg-white" />
                </Link>
                <Link prefetch={false} href="/categories/oil-free-silent-air-compressors" className="block">
                  <Photo src={storageUrl("silent-083.webp")} alt="Everest silent air compressor" className="h-auto w-full rounded-xl bg-white" />
                </Link>
              </div>
              <p className="on-ink mt-4 text-[15px] text-muted-on-dark">Based in Pimpri-Chinchwad, Maharashtra.</p>
            </div>
          }
        />

        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-4">
          <StatBlock value={`Since ${site.established}`} label="Everest Hydro Pneumatic" />
          <StatBlock value={`${ratings.google.score} / 5`} label={`${ratings.google.count} Google reviews`} />
          <StatBlock value={`${ratings.indiamart.score} / 5`} label={`${ratings.indiamart.count} IndiaMART reviews`} />
          <StatBlock value="TrustSEAL" label="On IndiaMART" />
        </dl>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-card bg-surface p-6 md:p-8">
            <h2 className="display card-title">What we do</h2>
            <p className="mt-3 text-lg">Manufacturer, dealer and end-user supplier.</p>
            <h2 className="display card-title mt-7">Who we sell to</h2>
            <p className="mt-3 text-lg">Factories, clinics, workshops, homes and dealers.</p>
            <Link prefetch={false} href="/dealers" className="btn btn-outline mt-7">For dealers</Link>
          </div>
          <div className="on-ink rounded-card bg-ink p-6 text-white md:p-8">
            <h2 className="display card-title">Visit or call us</h2>
            <p className="mt-3 text-lg">{site.address}</p>
            <p className="mt-3 text-muted-on-dark">{site.hours}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={maps} target="_blank" rel="noreferrer" className="btn btn-white">Open in Maps</a>
              <a href={site.phoneHref} className="btn btn-outline-white tabular">{site.phoneDisplay}</a>
            </div>
            <p className="tabular mt-5 text-[15px] text-muted-on-dark">GSTIN {site.gstin}</p>
          </div>
        </div>
      </section>

      <section className="page section">
        <h2 className="display section-title mb-6">What we supply.</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryTile key={category.name} category={category} />
          ))}
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
