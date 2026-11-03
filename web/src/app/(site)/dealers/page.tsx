import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { getCategoryTiles, getProducts, getSite } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Dealers" };

// The enquiry form lives only on the contact page.
export default async function DealersPage() {
  const [categories, products, site] = await Promise.all([getCategoryTiles(), getProducts(), getSite()]);
  return (
    <section className="page">
      <PageTitle
        title="Stock Everest."
        intro={`We sell to dealers. Talk to us about trade supply across ${products.length} models in ${categories.length} categories.`}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={whatsappLink(site.whatsappNumber)} className="btn btn-primary">WhatsApp us</a>
        <Link prefetch={false} href="/contact" className="btn btn-outline">Send a dealer enquiry</Link>
      </div>
    </section>
  );
}
