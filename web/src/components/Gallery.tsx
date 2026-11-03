"use client";

import { useState } from "react";

type Img = { src: string; alt: string };

// Main photo with arrows and clickable thumbnails. The main photo itself is not a link.
export function Gallery({ images }: { images: Img[] }) {
  const [i, setI] = useState(0);
  if (images.length === 0) return null;
  const cur = images[i];
  const go = (d: number) => setI((n) => (n + d + images.length) % images.length);

  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[4/3] rounded-panel border border-line bg-surface md:aspect-auto md:min-h-[360px] md:flex-1">
        <div className="absolute inset-0 flex items-center justify-center p-5 md:p-10">
          <img
            key={cur.src}
            src={cur.src}
            alt={cur.alt}
            width={1200}
            height={900}
            fetchPriority={i === 0 ? "high" : undefined}
            className="h-full w-full object-contain"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface hover:border-ink"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface hover:border-ink"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, n) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}`}
              aria-current={n === i ? "true" : undefined}
              className={`h-[72px] w-[72px] shrink-0 overflow-hidden rounded-card border-2 bg-surface p-1 ${n === i ? "border-ink" : "border-line hover:border-line-strong"}`}
            >
              <img src={img.src} alt="" width={72} height={72} loading="lazy" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
