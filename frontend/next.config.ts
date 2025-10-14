import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary's base domain
        pathname: "/**", // allow all paths (or narrow it down if you prefer)
      },
      {
        protocol: "https",
        hostname: "codetaineracad.vercel.app", // Cloudinary's base domain
        pathname: "/**", // allow all paths (or narrow it down if you prefer)
      },
    ],
  },
};

export default nextConfig;
