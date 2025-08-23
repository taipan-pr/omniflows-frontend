import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export async function GET(request: NextRequest) {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: ENV.APP_ENV,
      version: ENV.APP_VERSION,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: ENV.APP_ENV,
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}