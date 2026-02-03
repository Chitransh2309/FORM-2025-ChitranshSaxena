import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/upload",
        destination: "http://localhost:8000/upload",
      },
    ];
  },
};

export default nextConfig;

