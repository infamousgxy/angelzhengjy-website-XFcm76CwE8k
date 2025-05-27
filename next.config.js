/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config options here...
  devIndicators: {
    // buildActivity: false, // Removed as it's deprecated
    position: 'bottom-right', // Renamed from buildActivityPosition
  },
  experimental: {
    // This allows specified origins to access the dev server
    allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.66.235:3000"],
  }
};

module.exports = nextConfig; 