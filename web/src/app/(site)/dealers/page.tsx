import type { Metadata } from "next";
import { abs, pageMeta } from "@/lib/seo";
import Link from "next/link";
import { CategoryTile, ContactPanel, PageHero, Photo } from "@/components/ui";
import { getCategoryTiles, getProducts, getSite, storageUrl } from "@/lib/data";
import { waLink } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "Dealers: stock Everest", description: "Everest sells to dealers. Ask about trade supply of oil-free compressors, screw compressors, pallet trucks and stackers. We reply within 24 hours.", path: "/dealers" });

const steps = [
  { title: "Tell us", text: "Your area, and the categories you want to stock." },
  { title: "We reply", text: "Within 24 hours, on WhatsApp, phone or email." },
  { title: "Get a quote", text: "A trade quote for the models you choose." },
];

// The enquiry form lives only on the contact page.
export default async function DealersPage() {
  const [categories, products, site] = await Promise.all([getCategoryTiles(), getProducts(), getSite()]);
  return (
    <>
      <section className="page">
        <PageHero
          kicker="For dealers"
          title="Stock Everest."
          intro={`We sell to dealers. Talk to us about trade supply across ${products.length} models in ${categories.length} categories.`}
          actions={
            <>
              <a href={waLink(site.whatsappNumber, "Hello Everest, I am a dealer. Please share your dealer terms.", abs("/dealers"))} data-cta="dealers" className="btn btn-primary">
                WhatsApp us
              </a>
              <Link prefetch={false} href="/contact" className="btn btn-outline">Send a dealer enquiry</Link>
            </>
          }
          aside={
            <div className="grid grid-cols-3 items-end gap-3 rounded-panel bg-surface p-5 md:p-7">
              <Link prefetch={false} href="/categories/pallet-trucks" className="block">
                <Photo src={storageUrl("pallet-107.webp")} alt="Everest hand pallet truck" className="on-ground h-auto w-full" />
              </Link>
              <Link prefetch={false} href="/categories/oil-free-silent-air-compressors" className="block">
                <Photo src={storageUrl("silent-083.webp")} alt="Everest silent air compressor" className="on-ground h-auto w-full" />
              </Link>
              <Link prefetch={false} href="/categories/stackers-and-lifting-tables" className="block">
                <Photo src={storageUrl("estacker-024.webp")} alt="Everest electric stacker" className="on-ground h-auto w-full" />
              </Link>
            </div>
          }
        />
      </section>

      <section className="page section">
        <h2 className="display section-title mb-6">How to start.</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-card bg-surface p-6 md:p-7">
              <span className="display tabular text-[15px] font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display card-title mt-2">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="page section">
        <h2 className="display section-title mb-6">What you can stock.</h2>
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
