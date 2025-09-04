import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Clean production-ready config
  reactStrictMode: true,
  // Optimize for Netlify deployment
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
