import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // 👇 rewrites যোগ করুন
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // আপনার ব্যাকএন্ডের ঠিকানা
      },
    ];
  },
};

export default nextConfig;