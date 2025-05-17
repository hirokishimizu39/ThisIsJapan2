/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['source.unsplash.com', 'images.unsplash.com'],
  },
  // ハイドレーションエラーの抑制
  reactStrictMode: false,
  // 必要に応じて他の設定を追加
};

module.exports = nextConfig; 