/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com", "images.microcms-assets.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
    // 画像最適化の設定を追加
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // パフォーマンス最適化
  reactStrictMode: false,
  trailingSlash: false,
  poweredByHeader: false, // X-Powered-By ヘッダーを無効化
  compress: true, // gzip圧縮を有効化
  // 実験的機能（パフォーマンス向上）
  experimental: {
    optimizeCss: true, // CSS最適化
    scrollRestoration: true, // スクロール位置復元
  },
  async rewrites() {
    return [
      {
        source: '/checkout/:id',
        destination: '/checkout/:id/page',
      },
    ];
  },
};

module.exports = nextConfig;
