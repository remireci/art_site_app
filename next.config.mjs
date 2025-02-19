/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push("vm2");
        }
        return config;
    },
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qajctwxzbqddkfsqhrwn.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-1070865a23b94011a35efcf0cf91803e.r2.dev',
                port: '',
                pathname: '/agenda/**',
            }
        ],
    }
};

export default nextConfig;
