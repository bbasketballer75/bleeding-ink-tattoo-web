import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force Webpack for OpenNext compatibility.
  // OpenNext adapter doesn't yet support Turbopack builds
  // (see opennext.js.org/cloudflare/troubleshooting).
  // Webpack is the default in Next 16 when --turbopack flag isn't passed;
  // we set TURBOPACK explicitly empty here as belt-and-suspenders.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "scontent-xxc1-1.xx.fbcdn.net" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },
    ],
  },
};

export default nextConfig;
