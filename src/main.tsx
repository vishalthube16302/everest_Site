import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App.tsx';
import './index.css';

/**
 * US-007 – SPA Pre-rendering
 *
 * ViteReactSSG replaces ReactDOM.createRoot as the app entry point.
 *
 * Runtime behaviour (two modes):
 *   • `npm run dev`  → behaves identically to a normal Vite SPA dev server.
 *     The browser hydrates the app as usual; no change in developer experience.
 *
 *   • `npm run build` (vite-react-ssg build) →
 *     Renders every route listed in vite.config.ts `ssgOptions.includedRoutes`
 *     to a static HTML file in dist/.  Each file contains the fully-rendered
 *     component tree, all react-helmet-async <head> tags (title, meta,
 *     canonical, JSON-LD schemas) baked directly into the markup.
 *     Googlebot receives real HTML content on the very first HTTP response,
 *     with no JavaScript execution required for indexing.
 *
 * The exported name `createRoot` is the convention required by vite-react-ssg;
 * the CLI imports and calls this export during the build step.
 */
export const createRoot = ViteReactSSG({ routes });