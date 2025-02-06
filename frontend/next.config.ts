import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig: NextConfig = {
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
          process.env.NODE_ENV === 'development'
            ? '/api/:path*' // MSW가 처리하도록 함
            : 'http://i12b207.p.ssafy.io:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
