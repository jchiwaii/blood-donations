import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_678_400, // 31 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560],
    imageSizes: [16, 32, 40, 48, 64, 96, 128, 256, 384, 470, 570],
  },
};

export default nextConfig;
