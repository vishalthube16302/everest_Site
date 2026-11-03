import type { Metadata } from "next";
import { ContactPanel, PageTitle } from "@/components/ui";
import { getSite } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const site = await getSite();
  const { ratings } = site;
  const facts = [
    ["Established", String(site.established)],
    ["What we do", "Manufacturer, dealer and end-user supplier"],
    ["Who we sell to", "Factories, clinics, workshops, homes and dealers"],
    ["Google rating", `${ratings.google.score} from ${ratings.google.count} reviews`],
    ["IndiaMART rating", `${ratings.indiamart.score} from ${ratings.indiamart.count} reviews, TrustSEAL`],
    ["GSTIN", site.gstin],
    ["Address", site.address],
    ["Hours", site.hours],
  ];
  return (
    <>
      <section className="page">
        <PageTitle title={`About ${site.name}`} intro={site.tagline} />
        <dl className="mt-8 max-w-[860px]">
          {facts.map(([label, value]) => (
            <div key={label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[200px_1fr]">
              <dt className="text-muted">{label}</dt>
              <dd className="font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <ContactPanel />
    </>
  );
}
