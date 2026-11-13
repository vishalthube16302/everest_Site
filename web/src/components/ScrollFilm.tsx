"use client";

import { useEffect, useRef, useState } from "react";
import { filmUrl } from "@/lib/site";

type Part = { name: string; from: number; to?: number };

const FRAMES = 120; // 8 s at 15 frames a second
const FPS = 15;

// Scroll path: open (0 to .58), hold, close (.68 to .92), then the quote button.
function frameFor(p: number) {
  const last = FRAMES - 1;
  if (p < 0.58) return (p / 0.58) * last;
  if (p < 0.68) return last;
  if (p < 0.92) return (1 - (p - 0.68) / 0.24) * last;
  return 0;
}

export function ScrollFilm({
  name,
  kicker,
  title,
  parts,
  quoteHref,
}: {
  name: string;
  kicker: string;
  title: string;
  parts: Part[];
  quoteHref: string;
}) {
  const stage = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<number[]>([]);
  const [quote, setQuote] = useState(false);

  useEffect(() => {
    const el = stage.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const imgs: HTMLImageElement[] = [];
    // Phones load every second frame: half the data, and the nearest frame is drawn in between.
    const step = window.matchMedia("(max-width: 899px)").matches ? 2 : 1;
    let started = false;
    let cur = 0;
    let drawn = -1;
    let raf = 0;
    let visible = false;

    function load() {
      if (started) return;
      started = true;
      for (let i = 0; i < FRAMES; i++) {
        const im = new Image();
        if (i % step !== 0 && i !== FRAMES - 1) {
          imgs.push(im);
          continue;
        }
        im.decoding = "async";
        im.src = filmUrl(`/films/scroll/${name}/${String(i + 1).padStart(3, "0")}.jpg`);
        if (i === 0 || (calm && i === FRAMES - 1)) {
          im.onload = () => draw(calm ? FRAMES - 1 : 0, true);
        }
        imgs.push(im);
      }
    }

    function draw(f: number, force = false) {
      const im = imgs[f];
      if (!im || !im.complete || !im.naturalWidth) return false;
      if (f === drawn && !force) return true;
      ctx!.drawImage(im, 0, 0, cv!.width, cv!.height);
      drawn = f;
      return true;
    }

    function tick() {
      raf = 0;
      if (!el) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      cur += (frameFor(p) - cur) * 0.16;
      let f = Math.round(cur);
      // If this frame has not arrived yet, use the nearest one that has.
      for (let d = 0; d < FRAMES && !draw(f); d++) f = Math.max(0, f + (cur > f ? -1 : 1));
      const t = cur / FPS;
      const on: number[] = [];
      parts.forEach((pt, i) => {
        if (t >= pt.from - 0.1 && t <= (pt.to ?? 8)) on.push(i);
      });
      setActive((prev) => (prev.join() === on.join() ? prev : on));
      setQuote(p > 0.93);
      if (bar.current) bar.current.style.width = `${p * 100}%`;
      if (visible) raf = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) load();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    const watch = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf && !calm) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px" },
    );
    watch.observe(el);

    return () => {
      io.disconnect();
      watch.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <section
      ref={stage}
      aria-label={title}
      className="on-ink relative h-[250vh] md:h-[290vh] bg-[#050404] text-white"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas
          ref={canvas}
          width={1280}
          height={720}
          role="img"
          aria-label={`${title}, shown opening part by part as you scroll`}
          className="absolute left-1/2 top-[46%] aspect-video w-[122%] max-w-none -translate-x-1/2 -translate-y-1/2 md:inset-0 md:left-0 md:top-0 md:h-full md:w-full md:translate-x-0 md:translate-y-0 md:object-contain"
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_40px_#050404]" />

        <div className="absolute left-4 top-5 z-10 md:left-12 md:top-10">
          <span className="block text-[11px] uppercase tracking-[0.28em] text-muted-on-dark">{kicker}</span>
          <b className="display mt-1 block text-[clamp(20px,2.4vw,32px)] font-normal">{title}</b>
        </div>

        <ul className="absolute bottom-[108px] left-4 right-4 z-10 flex flex-wrap gap-x-4 text-[15px] md:bottom-auto md:left-auto md:right-12 md:top-10 md:block md:w-[200px]">
          {parts.map((pt, i) => {
            const on = active.includes(i);
            return (
              <li
                key={pt.name}
                className={`items-center justify-between gap-3 py-[3px] transition-opacity duration-300 md:flex md:border-t md:border-white/15 md:py-[11px] md:text-[14px] md:last:border-b ${
                  on ? "flex opacity-100" : "hidden opacity-40 md:flex"
                }`}
              >
                <span>{pt.name}</span>
                <i className={`hidden text-[11px] not-italic tabular-nums md:inline ${on ? "text-brand-on-ink" : ""}`}>
                  0{i + 1}
                </i>
              </li>
            );
          })}
        </ul>

        <div
          className={`absolute bottom-[120px] left-1/2 z-20 -translate-x-1/2 transition-all duration-300 md:bottom-[9vh] ${
            quote ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <a href={quoteHref} className="btn btn-primary">Request a quote</a>
        </div>

        <div className="absolute bottom-[92px] left-4 right-4 z-10 h-px bg-white/15 md:bottom-5 md:left-12 md:right-12">
          <span ref={bar} className="absolute inset-y-0 left-0 w-0 bg-brand-on-ink" />
        </div>
      </div>
    </section>
  );
}
