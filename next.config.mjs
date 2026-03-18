/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress "The user aborted a request" noise from Turbopack navigation
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Don't treat AbortError as a fatal during RSC streaming
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
