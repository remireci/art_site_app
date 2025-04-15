/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "vm2"];
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qajctwxzbqddkfsqhrwn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "pub-1070865a23b94011a35efcf0cf91803e.r2.dev",
        pathname: "/agenda/**",
      },
    ],
    domains: [
      "qajctwxzbqddkfsqhrwn.supabase.co",
      "pub-1070865a23b94011a35efcf0cf91803e.r2.dev",
    ],
  },

  async redirects() {
    return [
      {
        source: '/locations/:slug',
        destination: '/exhibitions/locations/:slug',
        permanent: true,
      },
    ]
  }
};

export default withNextIntl(nextConfig);
