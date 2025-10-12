import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tiketa-51fb.onrender.com",
        pathname: "/uploads/**", // ✅ matches /uploads/events/... or any subfolder
      },
    ],
  },
};

export default nextConfig;
