import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';
import  withPWAInit  from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === "development" ? false : undefined, // 개발 모드에서도 PWA 활성화
  register: true, // 자동으로 service worker 등록
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  compiler: {
    styledComponents: {
      ssr: true,
    },
  },

  output: 'standalone',

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
            : 'https://i12b207.p.ssafy.io/api/:path*',
      },
    ];
  },
};

export default withPWA(nextConfig);
