/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.atlassian.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '**',
      }
    ]
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 