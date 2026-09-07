/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.54.77.148'],
  async rewrites() {
    const backendUrl = process.env.NEXT_PRIVATE_API_URL || 'http://localhost:5000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/+$/, '')}/:path*`,
      },
    ];
  },
};

export default nextConfig;
