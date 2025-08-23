# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.0 frontend application built with TypeScript, Tailwind CSS, and the modern App Router architecture. The project implements a sophisticated multi-environment deployment system with Docker containerization and comprehensive CI/CD pipelines.

## Common Commands

**Development:**
- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start the production server (after running build)
- `npm run lint` - Run ESLint to check for code issues
- `npm run typecheck` - Run TypeScript compiler to check types
- `npm run env:validate` - Validate environment configuration

**Environment-Specific Builds:**
- `npm run build:dev` - Build with development environment
- `npm run build:prod` - Build with production environment

**Docker Commands:**
- `npm run docker:build` - Build standard Docker image
- `npm run docker:build:dev` - Build development Docker image  
- `npm run docker:build:prod` - Build production Docker image
- `npm run docker:run` - Run standard Docker container
- `npm run compose:local` - Run with docker-compose (local profile)
- `npm run compose:dev` - Run with docker-compose (development profile)

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with metadata and global styles
  - `page.tsx` - Home page component
  - `globals.css` - Global CSS with Tailwind and custom CSS variables
- `components/` - Reusable React components
  - `ui/` - Base UI components (buttons, inputs, etc.)
- `lib/` - Utility functions and helpers
  - `utils.ts` - Common utilities including `cn()` for className merging
- `public/` - Static assets (images, icons, etc.)

### Key Features

- **Next.js 15.5.0** with App Router and Turbopack support (beta)
- **TypeScript** with strict configuration and path aliases
- **Tailwind CSS** with custom CSS variables for theming and dark mode support
- **shadcn/ui-style components** with `cn()` utility for className composition
- **ESLint 9.0** with Next.js recommended configuration
- **Multi-environment system** with development, staging, and production configurations
- **Environment validation** through `lib/env.ts` with feature flags and configuration management

### Styling System

- Uses Tailwind CSS with custom CSS variables for consistent theming
- Supports light/dark mode through CSS custom properties
- `cn()` utility function combines clsx and tailwind-merge for proper className handling
- Base UI components follow shadcn/ui patterns

### Core Architecture Patterns

**Environment Management (`lib/env.ts`):**
- Centralized configuration with `ENV` constants and `CONFIG` objects
- Feature flags (`FEATURES.ANALYTICS`, `FEATURES.DEBUG_MODE`, etc.)
- Environment-specific API timeouts and logging levels
- Validation function to ensure required environment variables are set

**Next.js Configuration (`next.config.js`):**
- Standalone output mode for Docker containerization
- Environment-specific security headers (X-Frame-Options, X-Content-Type-Options in production)
- Dynamic image domains based on environment
- Custom environment variable injection

**API Structure:**
- Health check endpoint at `/api/health` returns environment info, uptime, and memory usage
- Environment-aware responses showing current deployment context

### Development Notes

- Uses React 18 with Next.js 15.5.0 and Node.js 22 LTS (latest stable with Turbopack beta support)
- All components are functional components with strict TypeScript
- Path aliases configured: `@/` → `app/`, `@/components/` → `components/`, `@/lib/` → `lib/`
- Environment variables must be validated using `npm run env:validate`

## Docker & Deployment

### Docker Configuration

Three specialized Dockerfiles optimized for Node.js 22 LTS and ARM64:
- `Dockerfile` - Standard production build with optimized multi-stage architecture
- `Dockerfile.development` - Development environment with debugging capabilities
- `Dockerfile.production` - Production-hardened with additional security measures
- `docker-compose.yml` - Multi-profile setup (local, development, production)
- `.dockerignore` - Excludes unnecessary files from Docker context

**Docker Build Optimizations:**
- Multi-stage builds with proper dependency separation
- ARM64-first architecture support (Node.js 22 Alpine)
- Proper public directory handling (includes `.gitkeep` for empty directories)
- Enhanced layer caching with GitHub Actions integration
- Security-focused user permissions (nextjs:nodejs)

### Build Docker Image Locally

```bash
docker build -t omniflows-frontend .
docker run -p 3000:3000 omniflows-frontend
```

### GitHub Actions CI/CD

Two workflows are configured:

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on push to main/development and PRs
   - Uses self-hosted runners for optimal performance
   - Tests on Node.js 20.x and 22.x (LTS versions)
   - Runs typecheck, lint, build, and smoke test

2. **Docker Build Pipeline** (`.github/workflows/docker-build.yml`)
   - Separate jobs for development and production environments
   - Uses self-hosted runners with native ARM64 support
   - Environment-specific builds with proper build args
   - Multi-platform builds (linux/arm64,linux/amd64)
   - GitHub environments for deployment approval
   - Enhanced caching with `provenance: false` for multi-platform builds
   - Only runs on push events (not PRs)

### Container Registry

Images are automatically pushed to GitHub Container Registry:
- Registry: `ghcr.io`
- Image: `ghcr.io/[username]/omniflows-frontend`
- Tags: branch names, commit SHA, and `latest` for main branch

### Running from Registry

```bash
docker run -p 3000:3000 ghcr.io/[username]/omniflows-frontend:latest
```

## Environment Management

### Environment Structure

The project supports three environments:

1. **Local** - Development on your machine
2. **Development** - Internal testing server (development branch)
3. **Production** - Live production server (main branch)

### Environment Configuration

**Environment Files:**
- `.env.local` - Local development (not committed)
- `.env.development` - Development server configuration
- `.env.production` - Production server configuration
- `.env.example` - Template for environment variables

**Environment Variables:**
- `NEXT_PUBLIC_APP_ENV` - Current environment (local/development/production)
- `NEXT_PUBLIC_API_BASE_URL` - API endpoint for each environment
- `NEXT_PUBLIC_APP_VERSION` - Version identifier

### Branch Strategy

- `main` - Production branch, auto-deploys to production
- `development` - Development branch, auto-deploys to development server
- `feature/*` - Feature branches, merge to development for testing

### Development Workflow

1. **Local Development:**
   ```bash
   npm run dev  # Uses .env.local
   ```

2. **Environment-Specific Builds:**
   ```bash
   npm run build:dev   # Development build
   npm run build:prod  # Production build
   ```

3. **Docker Development:**
   ```bash
   npm run docker:build:dev   # Build development image
   npm run docker:run:dev     # Run development container
   npm run compose:dev        # Use docker-compose for development
   ```

### Deployment Pipeline

**Development Environment (development branch):**
- Triggers on push to `development` branch
- Builds with `NEXT_PUBLIC_APP_ENV=development`
- Deploys to development server
- Image tagged as `:development`

**Production Environment (main branch):**
- Triggers on push to `main` branch
- Builds with `NEXT_PUBLIC_APP_ENV=production`
- Deploys to production server
- Image tagged as `:latest` and `:production`

### Environment-Specific Features

- **Security Headers:** Production includes additional security headers
- **Image Domains:** Environment-specific allowed image domains
- **API Endpoints:** Different API URLs per environment
- **Feature Flags:** Environment-based feature toggles in `lib/env.ts`

### Health Check

All environments include a health check endpoint:
```
GET /api/health
```

Returns environment info, status, and system metrics.

### Environment Validation

Validate environment configuration:
```bash
npm run env:validate
```

## Troubleshooting

### Docker Build Issues

**"failed to compute cache key: '/app/public': not found"**
- Ensure `public/.gitkeep` exists (already included in this repo)
- The Dockerfiles are configured to handle empty public directories

**Multi-platform Build Failures**
- GitHub Actions use `provenance: false` to prevent attestation issues
- ARM64 builds are prioritized for better performance on Apple Silicon

### GitHub Actions Failures

**Node.js Version Compatibility**
- CI tests on Node.js 20.x and 22.x (both LTS)
- Docker images use Node.js 22 Alpine for optimal performance
- Minimum required: Node.js 20.0.0 (see package.json engines)

**Environment Variables Missing**
- Run `npm run env:validate` to check required variables
- Ensure `.env.local` exists for local development
- Check GitHub secrets for deployment environments