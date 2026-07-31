/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    loader: "custom",
    loaderFile: "lib/supabase-image-loader.js",
    // domains: ["plus.unsplash.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "nzsdnmgddzliomknciuq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "api.crelands.com",
      },
    ],
    // unoptimized: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // increase as needed
    },
    // Remove caching
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },

  // This is only for dev mode, in production we will use a reverse proxy to route /api/rag/* to the backend server
  async rewrites() {
    return [
      {
        source: "/api/rag/:path*",
        destination: "https://crelands.com/api/rag/:path*",
      },
    ];
  },
};

export default nextConfig;
