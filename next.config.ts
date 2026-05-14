import type { NextConfig } from "next";

const r2Hostname = process.env.R2_PUBLIC_URL
  ? (() => { try { return new URL(process.env.R2_PUBLIC_URL).hostname; } catch { return ""; } })()
  : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placedog.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.dog.ceo",
        pathname: "/**",
      },
      { protocol: "https", hostname: "commons.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      ...(r2Hostname
        ? [{ protocol: "https" as const, hostname: r2Hostname, pathname: "/**" }]
        : []),
    ],
  },
};

export default nextConfig;
