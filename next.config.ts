import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Vercel handles API routes via serverless functions
  // No rewrites needed for production
};

export default nextConfig;