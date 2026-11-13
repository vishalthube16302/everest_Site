import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { FaqList } from "@/components/ui";
import { getSite } from "@/lib/data";
import { langPath, langs, type LangCode } from "@/lib/lang-pages";
import { faqJsonLd, pageMeta } from "@/lib/seo";

// Hindi and Marathi pages. Drafts stay noindex and out of the sitemap until lang.live is true.
type Props = { params: Promise<{ lang: string; slug?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return langs.flatMap((l) => l.pages.map((p) => ({ lang: l.code, slug: p.slug ? [p.slug] : [] })));
}

async function find(params: Props["params"]) {
  const { lang, slug } = await params;
  const l = langs.find((x) => x.code === lang);
  const page = l?.pages.find((p) => p.slug === (slug?.[0] ?? ""));
  return l && page ? { l, page } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await find(params);
  if (!found) return {};
  const { l, page } = found;
  const meta = pageMeta({ title: page.title, description: page.description, path: langPath(l.code, page.slug), lang: l.code });
  return { ...meta, title: { absolute: `${page.title} | Everest` }, ...(l.live ? {} : { robots: { index: false, follow: true } }) };
}

export default async function LangPage({ params }: Props) {
  const found = await find(params);
  if (!found) notFound();
  const { l, page } = found;
  const site = await getSite();
  const wa = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(l.ui.whatsappText)}`;
  const others = l.pages.filter((p) => p.slug !== page.slug);
  return (
    <div lang={l.code as LangCode}>
      <JsonLd data={faqJsonLd(page.faq)} />
      <section className="page">
        <p className="pt-3 text-[15px] text-muted">
          <Link prefetch={false} href={page.english} className="inline-block py-2 hover:text-brand" lang="en">{l.ui.english}</Link>
        </p>
        <div className="pt-5 md:pt-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand">Everest</p>
          <h1 className="display section-title mt-2">{page.h1}</h1>
          <p className="mt-3 max-w-[56ch] text-lg text-muted">{page.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa} className="btn btn-primary">{l.ui.whatsapp}</a>
            <a href={site.phoneHref} className="btn btn-outline tabular">{l.ui.call}: {site.phoneDisplay}</a>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {page.blocks.map((b) => (
            <div key={b.h} className="rounded-card bg-surface p-6 md:p-8">
              <h2 className="display card-title">{b.h}</h2>
              <p className="mt-3 text-muted">{b.p}</p>
            </div>
          ))}
        </div>
        <div className="on-ink mt-4 rounded-card bg-ink p-6 text-white md:p-8">
          <h2 className="display card-title">{l.ui.address}</h2>
          <p className="mt-3" lang="en">{site.address}</p>
          <p className="mt-2 text-muted-on-dark">{l.ui.hours}. {l.ui.reply}</p>
        </div>
        {others.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-x-5">
            {others.map((p) => (
              <Link key={p.slug} prefetch={false} href={langPath(l.code, p.slug)} className="inline-block py-2 font-semibold text-brand hover:underline">{p.h1} →</Link>
            ))}
          </p>
        )}
      </section>
      <section className="page section">
        <h2 className="display section-title mb-6">{l.ui.questions}</h2>
        <FaqList faq={page.faq} />
      </section>
    </div>
  );
}
