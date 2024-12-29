/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    domains: ['avatars.githubusercontent.com'], // GitHubアバターのドメインを許可
  },
};

module.exports = nextConfig;