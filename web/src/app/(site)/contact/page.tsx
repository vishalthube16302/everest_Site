import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageTitle } from "@/components/ui";
import { getSite } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const site = await getSite();
  return (
    <section className="page">
      <PageTitle title="Tell us what you need." intro="We reply within 24 hours." />
      <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
        <div className="rounded-panel bg-surface p-6 md:p-8">
          <EnquiryForm whatsapp={site.whatsappNumber} phoneDisplay={site.phoneDisplay} phoneHref={site.phoneHref} />
        </div>
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink(site.whatsappNumber)} className="btn btn-primary">WhatsApp us</a>
            <a href={site.phoneHref} className="btn btn-outline tabular">{site.phoneDisplay}</a>
          </div>
          <p><a href={`mailto:${site.email}`} className="hover:text-brand">{site.email}</a></p>
          <p className="text-muted">{site.address}</p>
          <p className="text-muted">{site.hours}</p>
          <p className="tabular text-muted">GSTIN {site.gstin}</p>
        </div>
      </div>
    </section>
  );
}
