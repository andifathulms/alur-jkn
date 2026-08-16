/** @type {import('next').NextConfig} */
const repoName = 'alur-jkn';

const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
