import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
  async redirects() {
    return [
      { source: "/cars", destination: "/voitures", permanent: true },
      { source: "/cars/:id((?!.*\\.).*)", destination: "/voitures/:id", permanent: true },
      { source: "/booking", destination: "/voitures", permanent: true },
      { source: "/booking/:path*", destination: "/reservation/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
