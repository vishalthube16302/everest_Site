import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Applies site_settings.background_color as a CSS custom property
 * (--site-bg) on the document root, so every "white background" surface
 * across the site — which now uses the `bg-surface` Tailwind class instead
 * of a hardcoded `bg-white` — updates instantly when the admin changes the
 * setting, without needing prop-drilling through every page/component.
 *
 * Falls back to #ffffff (via the CSS var default in tailwind.config.js)
 * until the fetch resolves, and silently no-ops on error, so a missing or
 * failed fetch never breaks the page.
 *
 * Intentionally NOT used for the Footer logo's white backing plate — that
 * one stays hardcoded white on purpose, so the logo stays legible even if
 * the admin sets the background to a dark color (see Footer.tsx).
 */
export function SiteThemeVars() {
  useEffect(() => {
    let cancelled = false;

    const applyBackground = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('background_color')
          .limit(1)
          .maybeSingle();

        if (!cancelled && !error && data?.background_color) {
          document.documentElement.style.setProperty('--site-bg', data.background_color);
        }
      } catch {
        // Silently keep the #ffffff fallback baked into the CSS variable default.
      }
    };

    applyBackground();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
