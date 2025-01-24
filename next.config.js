/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // Allow all paths under Unsplash
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io", // Add Appwrite's domain
        pathname: "/v1/storage/buckets/**", // Allow all paths under Appwrite storage buckets
      },
    ],
  },
};

module.exports = nextConfig;
