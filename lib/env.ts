// Environment configuration and validation
export const ENV = {
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'local',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export const isProduction = ENV.APP_ENV === 'production';
export const isDevelopment = ENV.APP_ENV === 'development';
export const isLocal = ENV.APP_ENV === 'local';

// Environment-specific configurations
export const CONFIG = {
  // API configuration
  API: {
    BASE_URL: ENV.API_BASE_URL,
    TIMEOUT: isProduction ? 10000 : 30000,
  },
  
  // Logging configuration
  LOGGING: {
    ENABLED: !isProduction,
    LEVEL: isProduction ? 'error' : 'debug',
  },
  
  // Feature flags
  FEATURES: {
    ANALYTICS: isProduction,
    DEBUG_MODE: isLocal || isDevelopment,
    MOCK_API: isLocal,
  },
} as const;

// Validate required environment variables
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_APP_ENV',
    'NEXT_PUBLIC_API_BASE_URL',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}