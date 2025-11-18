import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Konfigurasi untuk menangani upload file besar
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Limit untuk server actions
    },
  },
  
  // Konfigurasi image domains jika menggunakan Next Image
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
    unoptimized: true, // Optional: jika ingin disable image optimization
  },
};

export default nextConfig;