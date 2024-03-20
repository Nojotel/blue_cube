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
  webpack: (config) => {
    config.watchOptions = {
      ignored: ["**/.git/**", "**/.next/**", "**/node_modules/**"],
    };
    return config;
  },
};

export default nextConfig;
