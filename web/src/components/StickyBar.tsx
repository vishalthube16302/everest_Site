import Link from "next/link";
import { whatsappLink } from "@/lib/site";

export function StickyBar({ whatsapp }: { whatsapp: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 gap-2.5 border-t border-line bg-surface px-4 py-2.5 md:hidden">
      <a href={whatsappLink(whatsapp)} className="btn btn-outline btn-compact">WhatsApp</a>
      <Link prefetch={false} href="/contact" className="btn btn-primary btn-compact">Get a quote</Link>
    </div>
  );
}
