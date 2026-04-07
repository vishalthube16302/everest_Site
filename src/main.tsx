import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App.tsx';
import './index.css';

/**
 * US-007 — SPA Pre-rendering via vite-react-ssg
 *
 * CORRECT PATTERN (confirmed from vite-react-ssg v0.9.1 type definitions):
 *
 *   ViteReactSSG(routerOptions: RouterOptions, fn?, options?)
 *
 *   where RouterOptions = { routes: RouteRecord[], basename?, future? }
 *
 * PREVIOUS INCORRECT PATTERN (from last sprint — caused double-router bug):
 *
 *   ViteReactSSG(<App />)          ← App was a JSX element, not RouterOptions
 *   App wrapped its own BrowserRouter   ← created TWO routers: one from vite-react-ssg,
 *                                          one inside App — hydration mismatch on prod
 *
 * HOW THIS WORKS AT RUNTIME:
 *
 *   npm run dev  →  vite serves a normal CSR app. The browser creates a
 *                   BrowserRouter from the routes array. All Supabase data
 *                   fetches run in the browser as normal — no change to DX.
 *
 *   npm run build → vite-react-ssg renders each path in ssgOptions.includedRoutes
 *                   AND each path returned by getStaticPaths() on /products/:slug.
 *                   The rendered HTML contains fully-populated <head> tags and
 *                   all JSON-LD schemas baked in. Googlebot gets real content.
 *
 * The exported name `createRoot` is the exact name vite-react-ssg CLI looks for
 * when it imports the entry file during the build phase.
 */
export const createRoot = ViteReactSSG(
    { routes },
    // Optional setup callback — runs once per build route and once on client boot.
    // Kept minimal: no side effects needed at this stage.
    // ({ router, isClient }) => { /* e.g. install Pinia, i18n, etc. */ }
);