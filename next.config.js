/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Environment-specific configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Security headers
  async headers() {
    const headers = [];
    
    // Development environment headers
    if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
      headers.push({
        source: '/(.*)',
        headers: [
          {
            key: 'X-Environment',
            value: 'development',
          },
        ],
      });
    }
    
    // Production security headers
    if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
      headers.push({
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      });
    }
    
    return headers;
  },
  
  // Redirects for different environments
  async redirects() {
    return [
      // Add environment-specific redirects here
    ];
  },
  
  experimental: {
    // Enable experimental features as needed
  },
  
  images: {
    domains: [
      // Add allowed image domains based on environment
      ...(process.env.NEXT_PUBLIC_APP_ENV === 'production' 
        ? ['images.omniflows.com'] 
        : ['localhost', 'dev-images.omniflows.com']
      ),
    ],
  },
};

module.exports = nextConfig;