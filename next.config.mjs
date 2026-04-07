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
        source: "/locations/:slug",
        destination: "/exhibitions/locations/:slug",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // Normal sitemap index + language sitemaps
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/sitemap-en.xml",
        destination: "/api/sitemap/en",
      },
      {
        source: "/sitemap-nl.xml",
        destination: "/api/sitemap/nl",
      },
      {
        source: "/sitemap-fr.xml",
        destination: "/api/sitemap/fr",
      },

      // Image sitemap index + child sitemaps
      {
        source: "/sitemap-images.xml",
        destination: "/sitemap-images",
      },
      {
        source: "/sitemap-images-locations.xml",
        destination: "/sitemap-images-locations",
      },
      {
        source: "/sitemap-images-cities.xml",
        destination: "/sitemap-images-cities",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
