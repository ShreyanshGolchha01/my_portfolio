import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: process.env.ADMIN_VAULT_ROUTE || '/admin',
        destination: '/admin',
      },
      {
        source: process.env.RESUME_ROUTE || '/resume',
        destination: '/resume',
      }
    ];
  },
};

export default nextConfig;
