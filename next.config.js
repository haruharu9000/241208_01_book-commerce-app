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
  },
  reactStrictMode: false,
  trailingSlash: false,  // ← 追加
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
