import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This is to allow the Next.js dev server to accept requests from the
  // Firebase Studio preview URL.
  allowedDevOrigins: ['https://*.cloudworkstations.dev'],
  experimental: {
    // No experimental features are currently enabled.
  },
};

export default nextConfig;
