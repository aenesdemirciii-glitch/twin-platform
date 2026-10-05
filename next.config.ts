import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bu özellik sayesinde Next.js Turbopack kullanmayı bırakıp Webpack'e geçer!
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
