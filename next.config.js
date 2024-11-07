/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // If you want to restrict to specific image paths, you can add `pathname` as well
        pathname: "/**", // Allow all paths under this domain
      },
    ],
  },
};

module.exports = nextConfig;
