/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Everest brand palette ──────────────────────────────
        // Deep navy stays the primary brand color (matches the
        // existing site_settings.primary_color so DB-driven and
        // static usages line up). Gold replaces the old pure-red
        // accent for a warmer, premium industrial feel.
        navy: {
          DEFAULT: '#0f3460',
          light: '#1e4785',
          dark: '#0a2647',
        },
        gold: {
          DEFAULT: '#d97706',
          light: '#f59e0b',
          dark: '#b45309',
        },
        steel: {
          DEFAULT: '#64748b',
          light: '#94a3b8',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium-sm': '0 2px 10px rgba(15,52,96,0.06)',
        'premium-md': '0 6px 24px rgba(15,52,96,0.10)',
        'premium-lg': '0 12px 48px rgba(15,52,96,0.16)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0a2647 0%, #0f3460 60%, #1e4785 100%)',
      },
    },
  },
  plugins: [],
};
