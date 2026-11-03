import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is built ahead of time. Redirects and headers live in public/_redirects and public/_headers (read by Cloudflare Pages).
  output: "export",
  // One address per page, with no trailing slash. Old slash addresses are redirected (redirects.txt).
  trailingSlash: false,
  images: { unoptimized: true },
  turbopack: {
    // Keeps the build inside web/, away from the old site's config in the repo root.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
