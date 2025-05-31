/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'backend', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // 開発環境でのDocker接続問題を回避するため、画像最適化を無効化
    unoptimized: true,
  },
  // ハイドレーションエラーの抑制
  reactStrictMode: false,
  // lightningcssの問題を回避するために環境変数NEXT_SKIP_STYLESHEET_PROCESSING=trueを設定
  // この設定はDockerfile内と、package.jsonのスクリプトで設定済み
  
  // 環境変数の設定
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig; 