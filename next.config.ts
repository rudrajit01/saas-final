import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // project root যেখানে next.config.ts আছে, সেখানে থাকবে
    root: path.resolve(__dirname),
  },
};

export default nextConfig;