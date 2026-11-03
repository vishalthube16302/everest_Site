"use client";

import { useState } from "react";
import type { Film } from "@/lib/data";

// Poster first. The film downloads only after a tap: 720p on phones, 1080p on desktop.
export function FilmPlayer({ film }: { film: Film }) {
  const [src, setSrc] = useState<string | null>(null);
  const label = film.alt_text ?? "Product film";

  function play() {
    const phone = window.matchMedia("(max-width: 899px)").matches;
    setSrc(phone && film.video_url_small ? film.video_url_small : film.video_url);
  }

  return (
    <div className="on-ink relative aspect-video overflow-hidden rounded-panel bg-ink">
      {src ? (
        <video src={src} poster={film.poster_url ?? undefined} controls autoPlay muted playsInline aria-label={label} className="h-full w-full" />
      ) : (
        <button type="button" onClick={play} aria-label={`Play: ${label}`} className="group relative block h-full w-full cursor-pointer">
          {film.poster_url && <img src={film.poster_url} alt="" loading="lazy" className="h-full w-full object-cover" />}
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="#111316"><path d="M7 4.5v15l13-7.5z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
