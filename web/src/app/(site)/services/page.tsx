import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ContactPanel, PageHero } from "@/components/ui";
import { getServices } from "@/lib/data";

export const metadata: Metadata = pageMeta({ title: "Services", description: "Sales, installation and commissioning, annual maintenance contracts, repair and spare parts, and custom solutions from Everest. Installation and nearby delivery offered.", path: "/services" });

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="page">
        <PageHero
          kicker="What we do"
          title="Services"
          intro="Installation and nearby delivery are offered. Tell us what you need."
          actions={<Link prefetch={false} href="/contact" className="btn btn-primary">Talk to us</Link>}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.id}>
              <Link
                prefetch={false}
                href="/contact"
                className="tile group relative flex h-full min-h-[170px] flex-col rounded-card bg-surface p-6 md:p-7"
              >
                <span className="display tabular text-[15px] font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="display card-title mt-3">{service.title}</h2>
                <span className="mt-auto pt-5 text-[15px] font-semibold group-hover:text-brand">Ask us →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ContactPanel />
    </>
  );
}
