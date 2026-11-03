import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/ui";
import { getSite } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const site = await getSite();
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
  return (
    <section className="page pb-4">
      <PageHero kicker="Contact" title="Tell us what you need." intro="We reply within 24 hours." />
      <div className="mt-8 grid items-start gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-panel bg-surface p-6 md:p-8">
          <h2 className="display card-title mb-4">Send an enquiry</h2>
          <div className="min-h-[360px]">
            <EnquiryForm whatsapp={site.whatsappNumber} phoneDisplay={site.phoneDisplay} phoneHref={site.phoneHref} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="on-ink rounded-card bg-brand p-6 text-white md:p-7">
            <h2 className="display card-title">Quickest way</h2>
            <p className="mt-2">Message or call us now.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={whatsappLink(site.whatsappNumber)} className="btn btn-white">WhatsApp us</a>
              <a href={site.phoneHref} className="btn btn-outline-white tabular">{site.phoneDisplay}</a>
            </div>
          </div>

          <dl className="rounded-card bg-surface p-6 md:p-7">
            <div className="border-b border-line pb-4">
              <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="inline-block py-1 text-lg font-semibold hover:text-brand">{site.email}</a>
              </dd>
            </div>
            <div className="border-b border-line py-4">
              <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Address</dt>
              <dd className="mt-1">
                <p>{site.address}</p>
                <a href={maps} target="_blank" rel="noreferrer" className="mt-1 inline-block py-2 font-semibold text-brand hover:underline">
                  Open in Maps →
                </a>
              </dd>
            </div>
            <div className="border-b border-line py-4">
              <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Hours</dt>
              <dd className="mt-1">{site.hours}</dd>
            </div>
            <div className="pt-4">
              <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">GSTIN</dt>
              <dd className="tabular mt-1">{site.gstin}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
