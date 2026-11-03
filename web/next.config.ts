import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is built ahead of time. Redirects and headers live in public/_redirects and public/_headers.
  output: "export",
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
