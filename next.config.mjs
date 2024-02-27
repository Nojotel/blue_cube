const nextConfig = {
  images: {
    domains: ["static.detmir.st"],
  },
  async rewrites() {
    return [
      {
        source: "/products/:id",
        destination: "/products/:id",
      },
    ];
  },
};

export default nextConfig;
