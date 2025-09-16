/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 verwendet automatisch den App Router
  // Keine experimentellen Optionen mehr nötig

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'suwevnhwtmcazjugfmps.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
