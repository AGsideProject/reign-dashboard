/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**.unsplash.com",
//       },
//       {
//         protocol: "https",
//         hostname: "**.cloudinary.com",
//       },
//       {
//         protocol: "https",
//         hostname: "**.cdninstagram.com",
//       },

//       {
//         protocol: "https",
//         hostname: "**.fna.fbcdn.net",
//       },
//       {
//         protocol: "https",
//         hostname: "**.fbcdn.net",
//       },
//     ],
//   },
// };

// export default nextConfig;
