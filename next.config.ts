import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "",
  assetPrefix: "/",
  typedRoutes: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 skip TS errors if needed
  },
};

export default nextConfig;
