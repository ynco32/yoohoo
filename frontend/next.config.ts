import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack(config: WebpackConfig) {
    if (!config.module) {
      config.module = {
        rules: [],
      };
    }

    if (!config.module.rules) {
      config.module.rules = [];
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development' &&
          process.env.NEXT_PUBLIC_API_MOCKING !== 'disabled'
            ? '/api/:path*'
            : 'http://i12b207.p.ssafy.io:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
