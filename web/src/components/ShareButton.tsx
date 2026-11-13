"use client";

import { useEffect, useRef, useState } from "react";
import type { ShareContent } from "@/lib/share";

type Gtag = (command: string, name: string, params?: Record<string, unknown>) => void;

// Share one product: WhatsApp, email, copy link, and on phones the share sheet with the product photo attached.
// The text comes ready from lib/share.ts. WhatsApp shows the product photo from the page's share picture.
export function ShareButton({ share }: { share: ShareContent }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canSendPhoto, setCanSendPhoto] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Phones that can attach a file to the share sheet get the "with photo" choice.
  useEffect(() => {
    if (!share.image || !/\.jpe?g$/i.test(share.image) || !navigator.canShare) return;
    try {
      setCanSendPhoto(navigator.canShare({ files: [new File([""], "photo.jpg", { type: "image/jpeg" })] }));
    } catch {}
  }, [share.image]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  function track(method: string) {
    (window as unknown as { gtag?: Gtag }).gtag?.("event", "share", { method, content_type: "product", item_id: share.title });
  }

  async function sendPhoto() {
    track("photo");
    setOpen(false);
    try {
      const blob = await (await fetch(share.image!)).blob();
      const file = new File([blob], `${share.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.jpg`, { type: "image/jpeg" });
      await navigator.share({ files: [file], title: share.title, text: share.whatsapp });
    } catch {
      // Closed by the person, or the phone refused the file: nothing to do.
    }
  }

  async function copy() {
    track("copy");
    try {
      await navigator.clipboard.writeText(share.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const item = "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[15px] font-semibold hover:bg-ground";
  return (
    <div ref={box} className="relative">
      <button type="button" className="btn btn-outline" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        Share
      </button>
      {open && (
        <div role="menu" aria-label={`Share ${share.title}`} className="absolute bottom-full left-0 z-30 mb-2 w-[250px] rounded-card border border-line bg-surface p-2 shadow-[0_12px_40px_rgba(17,19,22,0.16)] md:bottom-auto md:top-full md:mb-0 md:mt-2">
          <a role="menuitem" className={item} target="_blank" rel="noopener noreferrer" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(share.whatsapp)}`} onClick={() => { track("whatsapp"); setOpen(false); }}>
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-[#1fa855]" />
            WhatsApp
          </a>
          <a role="menuitem" className={item} href={`mailto:?subject=${encodeURIComponent(share.emailSubject)}&body=${encodeURIComponent(share.emailBody)}`} onClick={() => { track("email"); setOpen(false); }}>
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
            Email
          </a>
          {canSendPhoto && (
            <button type="button" role="menuitem" className={item} onClick={sendPhoto}>
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
              Send with photo
            </button>
          )}
          <button type="button" role="menuitem" className={item} onClick={copy}>
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-line-strong" />
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
