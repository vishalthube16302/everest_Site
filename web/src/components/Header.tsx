"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header({ nav }: { nav: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="page">
      <div className="flex items-center justify-between gap-6 py-3 md:py-5">
        <Link prefetch={false} href="/" aria-label="Everest home" onClick={() => setOpen(false)}>
          <img src="/img/logo-red.png" alt="Everest" width={1474} height={325} className="h-10 w-auto md:h-11" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] font-medium md:flex">
          {nav.map((item) => (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className="py-2.5 hover:text-brand aria-[current=page]:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link prefetch={false} href="/contact" className="btn btn-dark hidden md:inline-flex">
          Get a quote
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="phone-menu"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
        >
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="phone-menu" aria-label="Phone" className="border-t border-line pb-4 md:hidden">
          {nav.map((item) => (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-3 text-lg font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
