/** @type {import('next').NextConfig} */

let supabaseHostname;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  }
} catch {
  // Ignore invalid or missing URL in build step
}

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  {
    protocol: 'https',
    hostname: '*.supabase.co',
  },
];

if (supabaseHostname && !remotePatterns.some((p) => p.hostname === supabaseHostname)) {
  remotePatterns.push({
    protocol: 'https',
    hostname: supabaseHostname,
  });
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;