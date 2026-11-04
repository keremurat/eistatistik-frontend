import type { NextConfig } from "next";

const apiOrigin = new URL(process.env.API_BASE_URL ?? "http://localhost:3001").origin;

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
