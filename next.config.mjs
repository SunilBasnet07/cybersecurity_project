/** @type {import('next').NextConfig} */
const nextConfig = {
    
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"res.cloudinary.com",
                pathname:"/djfop5zyp/**",
            },
        ],
    },
};

export default nextConfig;
