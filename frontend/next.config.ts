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

    // 스토리북 파일 제외
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // stories 디렉토리를 빈 모듈로 대체
        '^.+\\.stories\\.[jt]sx?$': false,
      },
    };

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
            : 'https://i12b207.p.ssafy.io/api/:path*',
      },
    ];
  },
};

export default nextConfig;
