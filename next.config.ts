import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: 'standalone',
  basePath: '',
  assetPrefix: '/',
  typedRoutes: true,
  compress: true,
};

export default nextConfig;