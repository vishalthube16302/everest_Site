"use client";

import { useEffect, useId, useRef, useState } from "react";
import { mountEnquiryForm } from "@/lib/lightning";
import { whatsappLink } from "@/lib/site";

const TIMEOUT_MS = 15000;

// Loads the Salesforce form only when it comes near the screen.
type Props = { productName?: string; whatsapp: string; phoneDisplay: string; phoneHref: string };

export function EnquiryForm({ productName, whatsapp, phoneDisplay, phoneHref }: Props) {
  const targetId = `enquiry-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"waiting" | "ready" | "failed">("waiting");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    let done = false;
    let timer: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          if (!done) setState("failed");
        }, TIMEOUT_MS);
        mountEnquiryForm(targetId)
          .then(() => {
            done = true;
            window.clearTimeout(timer);
            setState("ready");
          })
          .catch(() => {
            done = true;
            window.clearTimeout(timer);
            setState("failed");
          });
      },
      { rootMargin: "300px" },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [targetId, attempt]);

  return (
    <div ref={box}>
      <div id={targetId} />
      {state === "waiting" && <p className="text-muted">Loading the enquiry form...</p>}
      {state === "failed" && (
        <div role="alert">
          <p className="font-semibold text-brand">The enquiry form did not load.</p>
          <p className="mt-1 text-muted">Please reach us directly. We reply within 24 hours.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={whatsappLink(whatsapp, productName)} className="btn btn-primary">WhatsApp us</a>
            <a href={phoneHref} className="btn btn-outline tabular">{phoneDisplay}</a>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setState("waiting");
                setAttempt((n) => n + 1);
              }}
            >
              Try the form again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
