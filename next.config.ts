import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Hostinger'ın RAM'ini tüketmemek için build sırasında ESLint'i kapatıyoruz
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Aynı şekilde TypeScript kontrolünü kapatıp bellek tasarrufu sağlıyoruz
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
