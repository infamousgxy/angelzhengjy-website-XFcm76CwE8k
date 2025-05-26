/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置允许的开发源
  allowedDevOrigins: ['192.168.66.249'],
  
  // 启用静态导出（用于Cloudflare Pages）
  output: 'export',
  trailingSlash: true,
  
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  images: {
    // 使用 remotePatterns 替代已弃用的 domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.svg',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // 静态导出需要禁用图片优化
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
