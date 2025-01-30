/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/storage/buckets/**",
      }
    ],
  },
};

module.exports = nextConfig;
