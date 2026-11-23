const nextConfig = {
  output: "export",
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "header", key: "user-agent", value: "curl/.*" }],
          destination: "/hexagonal-bio.txt",
        },
      ],
    };
  },
};

export default nextConfig;
