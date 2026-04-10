/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'experai.vercel.app'],
    },
    turbo: {
      root: '/workspace/experai',
    },
  },
};

export default nextConfig;
