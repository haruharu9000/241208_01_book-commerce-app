const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: '',
        pathname: '/**', // すべてのパスを許可
        search: '',
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        port: '',
        pathname: '/**', // すべてのパスを許可
        search: '',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Googleのプロフィール画像
        port: '',
        pathname: '/**', // すべてのパスを許可
        search: '',
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
