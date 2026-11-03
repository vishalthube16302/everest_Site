import type { Metadata } from "next";
import { ContactPanel, PageTitle } from "@/components/ui";
import { getServices } from "@/lib/data";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="page">
        <PageTitle title="Services" intro="Installation and nearby delivery are offered. Tell us what you need." />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="rounded-card bg-surface p-6">
              <h2 className="display card-title">{service.title}</h2>
            </li>
          ))}
        </ul>
      </section>
      <ContactPanel />
    </>
  );
}
