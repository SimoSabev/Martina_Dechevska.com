import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tailwind output is ~8 KB gzipped: inlining it removes a render-blocking
    // request, which matters most for first-time mobile visitors.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
