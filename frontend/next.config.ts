import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

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
        pathname: '/**',  // 모든 경로 허용
      }
    ],
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
    compiler: {
      styledComponents: {
        ssr: true,
      },
    },
    output: 'standalone',
          port: '',
          pathname: '/private/img-**.png',
        },
      ],
    },
    compiler: {
      styledComponents: {
        ssr: true,
      },
    },
    output: 'standalone',

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
