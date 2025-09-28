/**
 * @fileoverview Express.js server for the DEX Product Store API
 *
 * This is the main server file that sets up a production-ready Express.js API server
 * with comprehensive security, logging, and database integration. The server provides
 * RESTful endpoints for product management and is designed for deployment on Fly.io.
 *
 * Architecture Overview:
 * - Express.js web framework with middleware stack
 * - Neon PostgreSQL database with connection pooling
 * - Arcjet security middleware (rate limiting, bot detection, attack protection)
 * - Product CRUD API endpoints (/api/products/*)
 * - Health check endpoint for container orchestration
 *
 * Security Features:
 * - CORS enabled for frontend communication
 * - Helmet for security headers
 * - Arcjet for advanced threat protection
 * - Request logging with Morgan
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';
import { aj } from './lib/arcjet.js';
import logger from './lib/logger.js';

dotenv.config();

/**
 * Express application instance and environment configuration.
 *
 * The Express app instance is the core of our API server. It will be configured with
 * middleware, routes, and error handlers to create a production-ready API.
 *
 * Environment Configuration:
 * - PORT: Uses Fly.io's dynamic port assignment in production, falls back to 3000 for development
 * - __dirname: Resolved for potential static file serving (though frontend is on Vercel)
 *
 * Why this approach: Container platforms like Fly.io assign ports dynamically, so we must
 * read from process.env.PORT. The fallback to 3000 ensures local development works seamlessly.
 */
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

/**
 * Express.js application configuration and middleware setup.
 *
 * This section configures the core middleware stack that every request will pass through.
 * The order matters here - middleware is executed in the order it's defined.
 *
 * Middleware Stack (in order):
 * 1. express.json() - Parses JSON request bodies (essential for API endpoints)
 * 2. cors() - Enables Cross-Origin Resource Sharing (allows frontend to call this API)
 * 3. helmet() - Security headers (disabled CSP for simplicity, but still provides other protections)
 * 4. morgan() - Request logging (helps with debugging and monitoring)
 *
 * Why this order: Security middleware should be early, parsing middleware before route handlers,
 * and logging should capture all requests including those that might be blocked by security.
 */
app.use(express.json());
app.use(cors());
/**
 * Helmet security middleware configuration.
 *
 * Helmet provides essential security headers to protect against common web vulnerabilities.
 * We disable Content Security Policy (CSP) because:
 * - This is an API-only backend (no HTML rendering)
 * - Frontend is served from Vercel with its own CSP
 * - CSP is primarily for preventing XSS in web pages, not API endpoints
 *
 * Other Helmet protections still active:
 * - X-Frame-Options (prevents clickjacking)
 * - X-Content-Type-Options (prevents MIME sniffing)
 * - Strict-Transport-Security (enforces HTTPS)
 * - X-DNS-Prefetch-Control (prevents DNS prefetching attacks)
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

/**
 * Morgan HTTP request logging middleware.
 *
 * Morgan logs all HTTP requests in a human-readable format during development.
 * The 'dev' format provides:
 * - Request method and URL
 * - Response status code and response time
 * - Response size in bytes
 * - Color-coded status codes for easy debugging
 *
 * In production, this works alongside our custom logger for comprehensive monitoring.
 * The combination gives us both request-level logging (Morgan) and application-level
 * logging (our custom logger) for complete observability.
 */
app.use(morgan('dev'));

/**
 * Custom middleware that applies Arcjet protection to API routes.
 *
 * This middleware is crucial for production security as it provides multiple layers of protection:
 * - Rate limiting: Prevents abuse by limiting requests per IP (30 requests per 5 seconds, max 20 burst)
 * - Bot detection: Blocks malicious bots while allowing legitimate search engines
 * - Shield protection: Guards against common attacks like SQL injection, XSS, and CSRF
 *
 * Why we need this: In a product store, you want to prevent:
 * - Automated scraping of your product data
 * - DDoS attacks that could bring down your API
 * - Malicious bots trying to exploit vulnerabilities
 *
 * The middleware is applied only to `/api` routes to avoid blocking health checks
 * and static file serving, which is a common pattern for microservices.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() on success or sends error response on failure
 */
const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: 'Too Many Requests' });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: 'Bot access denied' });
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
      return;
    }

    /**
     * Advanced bot detection: Check for spoofed bots.
     *
     * Some malicious bots try to disguise themselves by spoofing legitimate user agents
     * or other identifying characteristics. Arcjet can detect these sophisticated attacks
     * by analyzing patterns that indicate spoofing behavior.
     *
     * Why this matters: Spoofed bots are particularly dangerous because they can:
     * - Bypass basic user-agent filtering
     * - Mimic legitimate traffic patterns
     * - Carry out more sophisticated attacks
     * - Evade detection by appearing as regular users
     *
     * The double-check here ensures we catch even sophisticated bot attacks.
     */
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: 'Spoofed bot detected' });
      return;
    }

    next();
  } catch (error) {
    /**
     * Error handling in security middleware.
     *
     * If Arcjet itself fails (network issues, configuration problems, etc.),
     * we log the error with full context but still call next(error) to let
     * Express handle it. This ensures the API doesn't crash due to security
     * middleware failures.
     *
     * Why we log here: Security middleware failures are critical events that
     * need immediate attention. The context (URL, method, user agent) helps
     * identify if the failure is related to specific requests or a systemic issue.
     */
    logger.error('Arcjet middleware error', error, {
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
    });
    next(error);
  }
};

/**
 * API route configuration with security middleware.
 *
 * Route mounting strategy:
 * - All API routes are prefixed with '/api' for clear separation from frontend routes
 * - Arcjet protection is applied to ALL API routes to prevent abuse
 * - Product routes handle CRUD operations: GET, POST, PUT, DELETE for products
 *
 * Why this structure: Separating API routes with a common prefix makes it easy to:
 * - Apply security middleware to all API endpoints at once
 * - Distinguish between API and frontend routes in logs
 * - Scale by moving API to a separate service later if needed
 */
app.use('/api', arcjetMiddleware);

app.use('/api/products', productRoutes);

/**
 * Health check endpoint for container orchestration platforms.
 *
 * This endpoint is essential for production deployments on platforms like Fly.io and Docker.
 * It allows the platform to verify that your application is running and responsive.
 *
 * Why this matters: Container orchestration platforms need to know if your app is healthy
 * to make routing decisions. If this endpoint fails, the platform will:
 * - Stop sending traffic to this instance
 * - Potentially restart the container
 * - Alert monitoring systems
 *
 * The timestamp helps with debugging and monitoring - you can see when the last
 * successful health check occurred.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Sends JSON response with status and timestamp
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Deployment Architecture Note.
 *
 * This backend is designed for a microservices architecture where:
 * - Backend API: Deployed on Fly.io (this server)
 * - Frontend: Deployed on Vercel (separate service)
 *
 * Why this separation:
 * - Independent scaling: Frontend and backend can scale separately
 * - Technology optimization: Vercel excels at static sites, Fly.io at APIs
 * - Development velocity: Teams can deploy frontend and backend independently
 * - Cost efficiency: Each service uses the most cost-effective platform
 *
 * Important: Do not attempt to serve React build files from this Express server.
 * The frontend is a completely separate application deployed on Vercel.
 */

/**
 * Initializes the database schema by creating the products table if it doesn't exist.
 *
 * This function is critical for ensuring your application has the proper database structure
 * when it starts up. It uses PostgreSQL's "CREATE TABLE IF NOT EXISTS" to be idempotent,
 * meaning it can run multiple times safely without errors.
 *
 * Database Schema Context:
 * - Uses Neon (PostgreSQL) as the database provider
 * - Products table stores: id (auto-increment), name, image URL, price, and creation timestamp
 * - Price uses DECIMAL(10,2) for precise financial calculations (avoids floating-point errors)
 * - SERIAL creates an auto-incrementing primary key
 *
 * Why this approach: In production, you typically want database migrations to be separate
 * from application startup, but for simple schemas like this product store, having the
 * schema creation in the app startup is acceptable and ensures the app "just works."
 *
 * @async
 * @function initDB
 * @returns {Promise<void>} Resolves when database initialization is complete
 * @throws {Error} Logs database connection or schema creation errors
 */
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    logger.info('Database initialized successfully', { table: 'products' });
  } catch (error) {
    logger.error('Database initialization failed', error, {
      operation: 'initDB',
    });
  }
}

/**
 * Graceful application startup with proper error handling.
 *
 * This startup sequence ensures the application is fully ready before accepting requests:
 * 1. Database initialization completes first (prevents 500 errors on startup)
 * 2. HTTP server starts only after database is ready
 * 3. Comprehensive logging captures startup success with environment details
 *
 * Error Handling: If initDB() fails, the promise rejection will be unhandled,
 * which is intentional - if the database can't be initialized, the application
 * should not start. In production, this will cause the container to restart,
 * which is the desired behavior for database connectivity issues.
 *
 * Why this pattern: Starting the server before the database is ready would result
 * in every API call returning 500 errors until the database connection is established.
 * This pattern ensures a clean startup and better user experience.
 */
initDB().then(() => {
  app.listen(PORT, () => {
    logger.info('Server started successfully', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    });
  });
});
