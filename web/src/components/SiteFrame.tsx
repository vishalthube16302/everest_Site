import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyBar } from "@/components/StickyBar";
import { getSite } from "@/lib/data";

// Header, footer and phone bar around every public page. Menu and contact details come from the admin panel.
export async function SiteFrame({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-surface focus:p-3">
        Skip to content
      </a>
      <Header nav={site.nav} />
      <main id="main">{children}</main>
      <Footer site={site} />
      <StickyBar whatsapp={site.whatsappNumber} />
      <Analytics />
    </>
  );
}
