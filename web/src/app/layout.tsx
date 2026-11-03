import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";
import { site } from "@/lib/site";
import { indexable, siteUrl } from "@/lib/seo";
import "./globals.css";

// next/font downloads these at build time and serves them from this site.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

// Until SITE_INDEXABLE=true is set for launch, every page is noindex and robots.txt blocks crawlers.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s | Everest` },
  description: "Oil-free air compressors, pallet trucks and material handling equipment from Everest.",
  robots: indexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#F3F4F5" };

// Public pages get the header and footer from app/(site)/layout.tsx; admin has its own frame.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable}`}>
      <head>
        {/* Product photos come from Supabase storage: open that connection early. */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
