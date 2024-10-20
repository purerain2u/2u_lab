const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ytimg.com'],
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { dev, isServer }) => {
    // 외부 모듈 설정
    config.externals = [...(config.externals || []), 'tossPayments'];

    // 폰트 로더 설정
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/'
        }
      }
    });
    
    // '@' 별칭 및 추가 별칭 설정
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname),
        '@/src': path.resolve(__dirname, '../backend/src'),
        '@/utils': path.resolve(__dirname, '../backend/src/utils'),
        '@/controllers': path.resolve(__dirname, '../backend/src/controllers'),
        '@/middleware': path.resolve(__dirname, '../backend/src/middleware'),
        '@/lib': path.resolve(__dirname, '../backend/src/lib')
      };
    }
    
    // 클라이언트 사이드에서 fs 모듈 사용 방지
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          fs: false,
          net: false,
          tls: false,
        },
      };
    }

    return config;
  },
  // favicon을 위한 헤더 설정
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // 서버 사이드 렌더링 최적화
  poweredByHeader: false,
  // 빌드 ID 생성 최적화
  generateBuildId: async () => {
    return 'my-build-id'
  },
  // 압축 최적화
  compress: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // 추가: SWC 미니파이어 사용
  swcMinify: true,
  // 추가: 정적 페이지 생성 최적화
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;
