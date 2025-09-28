/**
 * @fileoverview Database Configuration for DEX Product Store API
 *
 * This module configures the PostgreSQL database connection using Neon's serverless
 * database service. Neon provides a fully managed PostgreSQL database with automatic
 * scaling, connection pooling, and serverless capabilities that are perfect for
 * modern applications.
 *
 * Key Features:
 * - Serverless PostgreSQL: Scales automatically based on demand
 * - Connection Pooling: Efficiently manages database connections
 * - SSL Security: All connections are encrypted in transit
 * - Tagged Template Literals: SQL injection protection through parameterized queries
 *
 * Why Neon: For a product store API, we need:
 * - Automatic scaling to handle varying traffic loads
 * - High availability and reliability for e-commerce operations
 * - Cost efficiency with pay-per-use pricing
 * - Zero maintenance database management
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variables for database connection.
 *
 * These variables are loaded from the .env file and used to construct the
 * PostgreSQL connection string. In production, these are set by the deployment
 * platform (Fly.io) for security.
 *
 * Security Note: Never commit these values to version control. They contain
 * sensitive database credentials that must be kept secure.
 *
 * @type {Object} Database connection parameters
 * @property {string} PGHOST - Neon database host endpoint
 * @property {string} PGDATABASE - Database name
 * @property {string} PGUSER - Database username
 * @property {string} PGPASSWORD - Database password
 */
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

/**
 * Neon serverless PostgreSQL database connection instance.
 *
 * This is the main database connection that provides a tagged template literal
 * function for executing SQL queries safely. The connection is established
 * using Neon's serverless architecture, which means:
 *
 * - No connection management needed: Neon handles connection pooling automatically
 * - Automatic scaling: Connections scale up/down based on demand
 * - High availability: Built-in failover and redundancy
 * - SSL encryption: All connections are encrypted in transit
 *
 * How it works: The `sql` function is a tagged template literal that:
 * 1. Takes a SQL query with embedded parameters using template literal syntax
 * 2. Automatically escapes and parameterizes all values to prevent SQL injection
 * 3. Executes the query against the Neon PostgreSQL database
 * 4. Returns a Promise that resolves to the query results
 *
 * Usage Examples:
 * ```javascript
 * // Simple query
 * const products = await sql`SELECT * FROM products`;
 *
 * // Parameterized query (SQL injection safe)
 * const product = await sql`SELECT * FROM products WHERE id = ${productId}`;
 *
 * // Insert with parameters
 * const newProduct = await sql`
 *   INSERT INTO products (name, price, image)
 *   VALUES (${name}, ${price}, ${image})
 *   RETURNING *
 * `;
 * ```
 *
 * Security Benefits:
 * - SQL Injection Protection: All parameters are automatically escaped
 * - Type Safety: Parameters maintain their JavaScript types
 * - Query Optimization: Neon optimizes queries for performance
 * - Connection Security: SSL/TLS encryption for all connections
 *
 * Connection String Breakdown:
 * - postgresql:// - PostgreSQL protocol
 * - ${PGUSER}:${PGPASSWORD} - Database credentials
 * - @${PGHOST} - Neon server endpoint
 * - /${PGDATABASE} - Database name
 * - ?sslmode=require - Enforce SSL encryption
 *
 * @type {Function} Tagged template literal function for SQL queries
 * @param {TemplateStringsArray} strings - SQL query template strings
 * @param {...any} values - Parameter values to be safely inserted
 * @returns {Promise<Array>} Promise resolving to query results
 * @throws {Error} Database connection or query execution errors
 * @see {@link https://neon.tech/docs} Neon Documentation
 * @see {@link https://neon.tech/docs/serverless/serverless-js} Neon Serverless JS SDK
 */
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

/**
 * Example connection string (for reference only).
 *
 * This shows the structure of a typical Neon connection string. In production,
 * the actual values are loaded from environment variables for security.
 *
 * Connection String Format:
 * postgresql://username:password@host/database?sslmode=require
 *
 * @example
 * // Development connection string structure
 * postgresql://neondb_owner:npg_NW8olSOGfx5E@ep-dawn-meadow-a83i0d05-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
 */
