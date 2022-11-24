/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // We rewrite the path to the internal API to the disable route starting with /api/ in the frontend to avoid proxy issues
    async rewrites() {
        return [
            {
                source: '/internal-api/:path*',
                destination: '/:path*'
            }
        ];
    }
};

module.exports = nextConfig;
