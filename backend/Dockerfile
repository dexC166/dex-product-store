# =============================================================================
# Dockerfile for DEX Product Store Backend API
# =============================================================================
#
# This Dockerfile creates a production-ready container for the Express.js API server.
# It's optimized for deployment on Fly.io with security, performance, and monitoring
# considerations. The container includes health checks and is designed for
# microservices architecture where the frontend is deployed separately on Vercel.
#
# Architecture Context:
# - Backend API: Express.js server with PostgreSQL database
# - Frontend: Separate React app deployed on Vercel
# - Database: Neon PostgreSQL (serverless, external to container)
# - Security: Arcjet middleware for rate limiting and bot detection
# - Deployment: Fly.io with auto-scaling and health monitoring
#
# Why Alpine Linux: Alpine provides a minimal, secure base image that:
# - Reduces attack surface (fewer packages = fewer vulnerabilities)
# - Minimizes image size (faster deployments and lower storage costs)
# - Includes only essential packages for Node.js applications
# - Has excellent security track record and regular updates

# Base Image: Node.js 18 on Alpine Linux
# =============================================================================
#
# Why Node.js 18: Latest LTS version with:
# - Long-term support until April 2025
# - Performance improvements and security patches
# - Full ES modules support (our app uses import/export)
# - Built-in fetch API and other modern features
#
# Why Alpine: Minimal Linux distribution that:
# - Uses musl libc instead of glibc (smaller, more secure)
# - Includes only essential packages (reduces attack surface)
# - Has excellent package management with apk
# - Results in ~5MB base image vs ~100MB+ for Ubuntu-based images
FROM node:18-alpine

# Working Directory Configuration
# =============================================================================
#
# Sets the working directory inside the container to /app.
# This is where all application files will be placed and where
# commands will be executed. It's a best practice to use a
# dedicated directory rather than the root filesystem.
#
# Why /app: Standard convention for application containers that:
# - Keeps application files organized and separate from system files
# - Makes it easier to manage permissions and security
# - Provides a clean, predictable location for the application
# - Follows Docker best practices and community standards
WORKDIR /app

# Dependency Installation (Layer Optimization)
# =============================================================================
#
# This section implements Docker layer caching optimization by copying
# package files first, then installing dependencies, then copying source code.
# This approach ensures that dependency installation only happens when
# package.json or package-lock.json changes, not when source code changes.
#
# Why this order matters:
# - Dependencies change less frequently than source code
# - Docker caches each layer independently
# - If only source code changes, Docker can reuse the dependency layer
# - This dramatically speeds up rebuilds during development

# Copy package files first (for dependency caching)
# =============================================================================
#
# Copies package.json and package-lock.json to the container.
# These files contain the dependency specification and exact versions.
# By copying them first, we can install dependencies before copying
# the rest of the source code, enabling Docker layer caching.
#
# Why package*.json: The wildcard copies both package.json and package-lock.json:
# - package.json: Contains dependency names and version ranges
# - package-lock.json: Contains exact versions and dependency tree
# - Both are needed for reproducible builds
COPY package*.json ./

# Install production dependencies only
# =============================================================================
#
# Installs only production dependencies, excluding development tools.
# This reduces the final image size and attack surface by not including
# development-only packages like testing frameworks, linters, etc.
#
# Why npm ci instead of npm install:
# - npm ci: Clean install from package-lock.json (faster, more reliable)
# - npm install: May modify package-lock.json (not suitable for production)
# - npm ci: Designed for automated environments (CI/CD, Docker)
# - npm ci: Skips package.json validation (faster)
#
# Why --omit=dev:
# - Excludes development dependencies (testing, linting, building tools)
# - Reduces image size by ~50-70% in typical Node.js applications
# - Reduces attack surface (fewer packages = fewer vulnerabilities)
# - Production containers don't need development tools
RUN npm ci --omit=dev

# Copy source code
# =============================================================================
#
# Copies all application source code to the container.
# This happens after dependency installation to leverage Docker layer caching.
# Only source code changes will invalidate this layer, not dependency changes.
#
# What gets copied:
# - All JavaScript/TypeScript source files
# - Configuration files (server.js, routes, controllers, etc.)
# - Static assets (if any)
# - Environment configuration files
#
# Why after dependencies: This order ensures that:
# - Dependencies are cached and only reinstalled when package files change
# - Source code changes don't trigger dependency reinstallation
# - Build times are optimized for development workflows
COPY . .

# Port Configuration
# =============================================================================
#
# Exposes port 8080 to the host system and external networks.
# This port must match the PORT environment variable and the
# internal_port setting in fly.toml for proper deployment.
#
# Port Mapping Context:
# - Container internal port: 8080 (where Express server listens)
# - Fly.io internal_port: 8080 (matches container port)
# - External HTTPS port: 443 (handled by Fly.io's load balancer)
# - External HTTP port: 80 (redirected to HTTPS by Fly.io)
#
# Why port 8080:
# - Standard alternative to port 3000 (avoids conflicts with other services)
# - Commonly used for containerized applications
# - Matches Fly.io configuration and deployment expectations
# - Avoids requiring root privileges (ports < 1024 require root)
EXPOSE 8080

# Health Check Configuration
# =============================================================================
#
# Implements Docker's built-in health check system that monitors
# application health and reports status to container orchestration platforms.
# This is essential for production deployments and automatic recovery.
#
# Health Check Parameters:
# - interval: 30s - How often to check health (matches Fly.io configuration)
# - timeout: 3s - Maximum time to wait for response (prevents hanging)
# - start-period: 5s - Grace period before starting checks (allows startup)
# - retries: 3 - Number of consecutive failures before marking unhealthy
#
# Health Check Command:
# - Uses Node.js to make HTTP request to /health endpoint
# - Checks for 200 status code (success) or other (failure)
# - Exits with 0 for healthy, 1 for unhealthy
# - Lightweight check that doesn't require external dependencies
#
# Why this approach:
# - Docker health checks are standard for container orchestration
# - Provides consistent health monitoring across different platforms
# - Enables automatic container restart on health failures
# - Integrates with Fly.io's health monitoring system
# - Lightweight and doesn't impact application performance
#
# Health Check Integration:
# - The /health endpoint is implemented in server.js
# - Returns 200 OK with timestamp when application is healthy
# - Does not require database connection (lightweight check)
# - Used by both Docker and Fly.io for health monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Application Startup
# =============================================================================
#
# Defines the command to run when the container starts.
# This command will be executed after the container is created and
# all the setup steps (dependency installation, file copying) are complete.
#
# Command Breakdown:
# - "npm": Runs the npm package manager
# - "start": Executes the start script defined in package.json
# - The start script runs "node server.js" (see package.json)
#
# Why npm start instead of direct node command:
# - Uses the start script defined in package.json (standard practice)
# - Allows for easy modification of startup command without changing Dockerfile
# - Provides consistency with local development (npm start works locally too)
# - Enables future enhancements (like adding environment-specific startup scripts)
#
# Application Startup Process:
# 1. Container starts and runs this command
# 2. npm start executes "node server.js"
# 3. server.js initializes database connection
# 4. Express server starts listening on port 8080
# 5. Health checks begin after 5-second grace period
# 6. Application is ready to handle requests
CMD ["npm", "start"]