/**
 * @fileoverview Arcjet Security Configuration for DEX Product Store API
 *
 * This module configures Arcjet, a comprehensive security service that provides
 * multiple layers of protection for our API endpoints. Arcjet acts as a security
 * middleware that analyzes incoming requests and blocks malicious traffic before
 * it reaches our application logic.
 *
 * Security Layers Configured:
 * - Shield Protection: Guards against common web attacks (SQL injection, XSS, CSRF)
 * - Bot Detection: Blocks malicious bots while allowing legitimate search engines
 * - Rate Limiting: Prevents abuse with token bucket algorithm (30 req/5sec, 20 burst)
 *
 * Why Arcjet: For a product store API, we need robust protection against:
 * - Automated scraping of product data
 * - DDoS attacks that could bring down our service
 * - Malicious bots attempting to exploit vulnerabilities
 * - Common web application attacks
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import arcjet, {
  tokenBucket,
  shield,
  detectBot,
  slidingWindow,
} from '@arcjet/node';

import 'dotenv/config';

/**
 * Arcjet security instance configured for production API protection.
 *
 * This is the main Arcjet instance that will be used by our Express middleware
 * to protect all API routes. It's configured with three critical security rules
 * that work together to provide comprehensive protection.
 *
 * Configuration Details:
 * - characteristics: ['ip.src'] - Tracks requests by source IP for rate limiting
 * - mode: 'LIVE' - All rules are active in production (not just monitoring)
 * - Environment: Uses ARCJET_KEY from environment variables for security
 *
 * How it works: When aj.protect(req) is called in middleware, Arcjet:
 * 1. Analyzes the request against all configured rules
 * 2. Returns a decision object indicating if the request should be allowed
 * 3. Provides detailed reasons for any denials (rate limit, bot, attack, etc.)
 *
 * @type {Object} Configured Arcjet instance ready for use in Express middleware
 * @see {@link https://arcjet.com/docs} Arcjet Documentation
 */
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    /**
     * Shield Protection Rule - Guards against common web application attacks.
     *
     * This rule provides the first line of defense against malicious requests by
     * detecting and blocking common attack patterns. It's particularly important
     * for APIs that handle user input and database operations.
     *
     * Attacks Prevented:
     * - SQL Injection: Detects malicious SQL in request parameters
     * - XSS (Cross-Site Scripting): Blocks script injection attempts
     * - CSRF (Cross-Site Request Forgery): Validates request authenticity
     * - Path Traversal: Prevents directory traversal attacks
     * - Command Injection: Blocks system command injection attempts
     *
     * Why LIVE mode: In production, we want to actively block attacks, not just
     * monitor them. This ensures our API is protected from the moment it goes live.
     *
     * @param {Object} config - Shield configuration
     * @param {string} config.mode - 'LIVE' enables active protection
     */
    shield({ mode: 'LIVE' }),

    /**
     * Bot Detection Rule - Blocks malicious bots while allowing legitimate traffic.
     *
     * This rule is crucial for a product store API because malicious bots can:
     * - Scrape product data and pricing information
     * - Overwhelm the API with automated requests
     * - Attempt to exploit vulnerabilities through automated tools
     * - Consume server resources and increase costs
     *
     * Bot Categories Blocked:
     * - Scrapers and crawlers (except search engines)
     * - Automated attack tools
     * - Spam bots and malicious crawlers
     * - Headless browsers used for scraping
     *
     * Bot Categories Allowed:
     * - Search engines (Google, Bing, etc.) for SEO
     * - Legitimate monitoring tools
     * - API testing tools (when properly configured)
     *
     * Why this matters: Search engines need access for SEO, but we want to block
     * everything else that could harm our API or steal our data.
     *
     * @param {Object} config - Bot detection configuration
     * @param {string} config.mode - 'LIVE' enables active bot blocking
     * @param {Array<string>} config.allow - List of allowed bot categories
     */
    detectBot({
      mode: 'LIVE',
      // block all bots except search engines
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        // see the full list at https://arcjet.com/bot-list
      ],
    }),

    /**
     * Rate Limiting Rule - Prevents API abuse with token bucket algorithm.
     *
     * This rule implements a sophisticated rate limiting system that allows
     * legitimate users to access the API while preventing abuse. The token
     * bucket algorithm is more flexible than simple rate limiting because
     * it allows for burst traffic while maintaining overall limits.
     *
     * Rate Limiting Configuration:
     * - refillRate: 30 tokens per interval (6 requests per second sustained)
     * - interval: 5 seconds (tokens refill every 5 seconds)
     * - capacity: 20 tokens (allows bursts up to 20 requests)
     *
     * How Token Bucket Works:
     * 1. Each request consumes 1 token
     * 2. Tokens refill at 30 per 5-second interval
     * 3. Maximum burst capacity is 20 tokens
     * 4. If no tokens available, request is rate limited (429 status)
     *
     * Why these limits: For a product store API, this allows:
     * - Normal browsing: 6 requests/second is plenty for human users
     * - Burst traffic: 20 requests can handle page loads with multiple API calls
     * - Abuse prevention: Prevents automated scraping and DDoS attacks
     *
     * Real-world example: A user browsing products might make 5-10 requests
     * to load a page (product list, individual products, images). This limit
     * allows that while preventing a bot from making hundreds of requests.
     *
     * @param {Object} config - Rate limiting configuration
     * @param {string} config.mode - 'LIVE' enables active rate limiting
     * @param {number} config.refillRate - Tokens added per interval
     * @param {number} config.interval - Time interval in seconds
     * @param {number} config.capacity - Maximum tokens in bucket
     */
    tokenBucket({
      mode: 'LIVE',
      refillRate: 30,
      interval: 5,
      capacity: 20,
    }),
  ],
});
