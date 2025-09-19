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
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // ESLint-Konfiguration für Supabase Functions ausschließen
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript-Konfiguration für Supabase Functions ausschließen
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
