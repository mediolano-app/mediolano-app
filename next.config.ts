import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle WebSocket and Node.js specific modules for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        os: false,
        url: false,
        assert: false,
        child_process: false,
        constants: false,
        buffer: false,
        util: false,
        path: false,
        zlib: false,
      };

      // Externalize ws module
      config.externals = config.externals || [];
      config.externals.push({
        ws: 'ws',
      });
    }

    // Handle ESM modules and improve module resolution
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      ws: false,
    };

    return config;
  },
};

export default nextConfig;