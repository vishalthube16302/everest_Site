"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";

// Phone bar: Call, WhatsApp and Get a quote. The WhatsApp message carries the page address, and on a product
// page it names the model (read from the page's data-page-product attribute).
export function StickyBar({ whatsapp, phoneHref }: { whatsapp: string; phoneHref: string }) {
  const pathname = usePathname();
  const [product, setProduct] = useState<string>();
  const [wa, setWa] = useState(() => whatsappLink(whatsapp));

  useEffect(() => {
    const name = document.querySelector<HTMLElement>("[data-page-product]")?.dataset.pageProduct || undefined;
    setProduct(name);
    setWa(whatsappLink(whatsapp, name, `${window.location.origin}${pathname}`));
  }, [pathname, whatsapp]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-[auto_1fr_1fr] gap-2.5 border-t border-line bg-surface px-4 py-2.5 md:hidden">
      <a href={phoneHref} data-cta="sticky" className="btn btn-outline btn-compact whitespace-nowrap px-4 text-[15px]">Call</a>
      <a href={wa} data-cta="sticky" data-product={product} className="btn btn-outline btn-compact whitespace-nowrap text-[15px]">WhatsApp</a>
      <Link prefetch={false} href="/contact" data-cta="sticky" className="btn btn-primary btn-compact whitespace-nowrap text-[15px]">Get a quote</Link>
    </div>
  );
}
