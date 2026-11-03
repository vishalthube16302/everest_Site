import Link from "next/link";
import type { SiteInfo } from "@/lib/data";

export function Footer({ site }: { site: SiteInfo }) {
  return (
    <footer className="page section pb-10 text-[15px] text-muted">
      <div className="grid gap-6 border-t border-line pt-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-semibold text-ink">{site.name}</p>
          <p className="mt-1 max-w-[52ch]">{site.address}</p>
          <p className="mt-1 tabular">GSTIN {site.gstin}</p>
        </div>
        <div>
          <p>
            <a href={site.phoneHref} className="hover:text-brand">{site.phoneDisplay}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="hover:text-brand">{site.email}</a>
          </p>
          <p>{site.hours}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
          {site.nav.map((item) => (
            <Link prefetch={false} key={item.href} href={item.href} className="hover:text-brand">{item.label}</Link>
          ))}
          {!site.nav.some((item) => item.href === "/gallery") && (
            <Link prefetch={false} href="/gallery" className="hover:text-brand">Gallery</Link>
          )}
          <Link prefetch={false} href="/privacy" className="hover:text-brand">Privacy</Link>
          <Link prefetch={false} href="/terms" className="hover:text-brand">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
