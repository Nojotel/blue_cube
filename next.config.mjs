const nextConfig = {
  images: {
    domains: ["static.detmir.st"],
  },
  async rewrites() {
    return [
      {
        source: "/products/:id",
        destination: "/product/:id",
      },
    ];
  },
};
export default nextConfig;
