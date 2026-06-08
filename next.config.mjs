/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/blog/:path*",
        destination: "https://blog.prizeless.ng/:path*",
      },
      {
        source: "/(.*)",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;