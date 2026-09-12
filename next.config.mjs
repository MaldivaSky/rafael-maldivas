/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // permite compilar em outra pasta sem derrubar o `next dev` que já está no ar
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
export default nextConfig;
