import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // <-- Required for Cloud Run / Docker deployment
};

export default nextConfig;
