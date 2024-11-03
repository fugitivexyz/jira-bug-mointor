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
    serverActions: {
      allowedOrigins: ['localhost:3000', 'jira-bug-monitor.vercel.app']
    }
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig 