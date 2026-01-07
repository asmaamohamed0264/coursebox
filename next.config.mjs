
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images:{
        domains:['firebasestorage.googleapis.com','img.clerk.com']
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Exclude native Node.js modules from client-side bundle
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                perf_hooks: false,
                child_process: false,
            };
        }
        return config;
    },
};

export default nextConfig;
