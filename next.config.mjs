
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images:{
        domains:['firebasestorage.googleapis.com','img.clerk.com']
    }
};

export default nextConfig;
