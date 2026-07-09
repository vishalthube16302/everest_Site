import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router (in SPA / client-side navigation mode) does NOT reset the
 * window's scroll position on navigation — the browser just keeps whatever
 * scrollY the previous page had. That's why clicking a product near the
 * bottom of a long scrolled Products page opened ProductDetail already
 * scrolled down instead of at the top.
 *
 * Mounted once in RootLayout, this resets scroll to the top on every
 * pathname change (but NOT on query-string-only changes, e.g. switching the
 * `?category=` filter on the Products page, so in-page filtering doesn't
 * unexpectedly yank the scroll position).
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
