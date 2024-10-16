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
    // Preact 최적화 (프로덕션 빌드에서만 적용)
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }

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
    
    // '@' 별칭 추가
    config.resolve.alias['@'] = path.resolve(__dirname);
    
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
};

module.exports = nextConfig;
