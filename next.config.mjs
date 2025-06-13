/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ['@node-rs/argon2'],
  
  // Remove the api configuration as it's not valid for Next.js 15+
  // File upload size limits are now configured in the API route itself
};

export default nextConfig;
