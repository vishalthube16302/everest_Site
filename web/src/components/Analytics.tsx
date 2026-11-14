"use client";

import Script from "next/script";
import { useEffect } from "react";

// Google Analytics 4. Loads only when NEXT_PUBLIC_GA_ID is set (production), only on public pages
// (it sits in the public layout, never in /admin), and only after the page is idle so it cannot slow the first view.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Gtag = (command: string, name: string, params?: Record<string, unknown>) => void;

// One listener for the whole page. Sends three events: click_call, click_whatsapp, click_quote.
// Nothing personal is sent: only the link kind, the page path, which button (data-cta, for example "product",
// "sticky", "price") and the product name when the link carries one (data-product).
function useClickEvents() {
  useEffect(() => {
    if (!GA_ID) return;
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      if (!link || !href || !gtag) return;
      const page = window.location.pathname;
      const cta = link.dataset.cta;
      const product = link.dataset.product;
      const extra = { ...(cta ? { cta } : {}), ...(product ? { product } : {}) };
      if (href.startsWith("tel:")) gtag("event", "click_call", { page, ...extra });
      else if (href.includes("wa.me/")) gtag("event", "click_whatsapp", { page, ...extra });
      else if (href === "/contact" || href.startsWith("/contact#")) gtag("event", "click_quote", { page, ...extra });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

export function Analytics() {
  useClickEvents();
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
