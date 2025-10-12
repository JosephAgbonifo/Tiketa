import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8765",
        pathname: "/uploads/**", // ✅ still covers /uploads/events/*
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8765",
        pathname: "/uploads/**", // ✅ include this for browsers resolving localhost as 127.0.0.1
      },
    ],
  },
};

export default nextConfig;
