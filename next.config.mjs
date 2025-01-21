/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qajctwxzbqddkfsqhrwn.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    }
};

export default nextConfig;
