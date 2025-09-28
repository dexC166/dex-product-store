/**
 * @fileoverview Database Seeding Script for DEX Product Store
 *
 * This module provides a database seeding utility that populates the products table
 * with realistic sample data for development, testing, and demonstration purposes.
 * It's designed to be run as a standalone script to initialize the database with
 * a consistent set of products that showcase the application's functionality.
 *
 * Seeding Purpose:
 * - Provides realistic test data for development and testing
 * - Ensures consistent data across different development environments
 * - Demonstrates the application's features with diverse product examples
 * - Enables quick database reset and re-population during development
 *
 * Data Characteristics:
 * - 8 diverse product categories (electronics, accessories, etc.)
 * - Realistic pricing ranges from $79.99 to $899.99
 * - High-quality Unsplash images for visual appeal
 * - Varied product names that represent different market segments
 *
 * Why this approach: Database seeding is essential for:
 * - Development: Provides immediate data for testing features
 * - Demo purposes: Shows the application with realistic content
 * - Testing: Ensures consistent test data across environments
 * - Onboarding: New developers can quickly see the app in action
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { sql } from '../config/db.js';
import logger from '../lib/logger.js';

/**
 * Sample product data for database seeding.
 *
 * This array contains realistic product data that represents a diverse range
 * of products typically found in an e-commerce store. Each product includes
 * essential fields that match the database schema: name, price, and image URL.
 *
 * Data Design Principles:
 * - Realistic pricing: Ranges from budget ($79.99) to premium ($899.99) items
 * - High-quality images: Uses Unsplash for professional, consistent imagery
 * - Diverse categories: Electronics, accessories, lifestyle products
 * - SEO-friendly names: Descriptive product names for better searchability
 *
 * Image Strategy:
 * - All images sourced from Unsplash for consistency and quality
 * - Optimized parameters: w=800&auto=format&fit=crop&q=60
 * - Consistent aspect ratios and professional photography
 * - No copyright issues (Unsplash provides free commercial use)
 *
 * Price Strategy:
 * - Varied price points to test different UI layouts
 * - Realistic e-commerce pricing patterns
 * - Includes both budget and premium options
 * - Decimal precision matches database DECIMAL(10,2) type
 *
 * @type {Array<Object>} Array of product objects for seeding
 * @property {string} name - Product name (required)
 * @property {number} price - Product price in USD (required)
 * @property {string} image - Product image URL (required)
 */
const SAMPLE_PRODUCTS = [
  {
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Smart Watch Pro',
    price: 249.99,
    image:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: '4K Ultra HD Camera',
    price: 899.99,
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Minimalist Backpack',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Wireless Gaming Mouse',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Smart Home Speaker',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'LED Gaming Monitor',
    price: 449.99,
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60',
  },
];

/**
 * Seeds the database with sample product data, clearing existing data first.
 *
 * This function performs a complete database reset and re-population process.
 * It's designed to be run as a standalone script that can be executed multiple
 * times safely, making it ideal for development, testing, and demo purposes.
 *
 * Seeding Process:
 * 1. Clear existing data: TRUNCATE TABLE with RESTART IDENTITY
 * 2. Insert sample products: Loop through SAMPLE_PRODUCTS array
 * 3. Log success/failure: Comprehensive logging for monitoring
 * 4. Exit process: Clean script termination with appropriate exit codes
 *
 * Database Operations:
 * - TRUNCATE TABLE products RESTART IDENTITY: Removes all data and resets auto-increment
 * - INSERT INTO products: Adds each product with parameterized values
 * - Parameterized queries prevent SQL injection attacks
 * - Each product gets a new auto-generated ID starting from 1
 *
 * Error Handling:
 * - Comprehensive try-catch for database operations
 * - Structured logging with operation context
 * - Process exit codes: 0 for success, 1 for failure
 * - Logs both success metrics and error details
 *
 * Why TRUNCATE with RESTART IDENTITY:
 * - TRUNCATE is faster than DELETE for removing all rows
 * - RESTART IDENTITY resets the auto-increment counter to 1
 * - Ensures consistent ID sequences across seeding runs
 * - More efficient than individual DELETE statements
 *
 * Why process.exit():
 * - Script is designed to run once and terminate
 * - Prevents the Node.js process from hanging
 * - Clear success/failure indication for automation
 * - Allows for proper error handling in CI/CD pipelines
 *
 * @async
 * @function seedDatabase
 * @returns {Promise<void>} Resolves when seeding is complete
 * @throws {Error} Logs database errors and exits with code 1
 */
async function seedDatabase() {
  try {
    // first, clear existing data
    await sql`TRUNCATE TABLE products RESTART IDENTITY`;

    // insert all products
    for (const product of SAMPLE_PRODUCTS) {
      await sql`
        INSERT INTO products (name, price, image)
        VALUES (${product.name}, ${product.price}, ${product.image})
      `;
    }

    logger.info('Database seeded successfully', {
      productCount: SAMPLE_PRODUCTS.length,
    });
    process.exit(0); // success code
  } catch (error) {
    logger.error('Database seeding failed', error, {
      operation: 'seedDatabase',
    });
    process.exit(1); // failure code
  }
}

/**
 * Execute the database seeding process immediately.
 *
 * This script is designed to be run directly with Node.js:
 * ```bash
 * node backend/seeds/products.js
 * ```
 *
 * The script will:
 * 1. Connect to the database using the configured connection
 * 2. Clear all existing product data
 * 3. Insert the sample products
 * 4. Log the results
 * 5. Exit with appropriate success/failure code
 *
 * Usage Scenarios:
 * - Development setup: Populate database with test data
 * - Testing: Reset database to known state
 * - Demo preparation: Ensure consistent data for presentations
 * - CI/CD: Automated database initialization
 *
 * Prerequisites:
 * - Database connection must be configured (environment variables)
 * - Products table must exist (created by server.js initDB)
 * - Sufficient database permissions for TRUNCATE and INSERT
 *
 * @see {@link ../config/db.js} Database connection configuration
 * @see {@link ../server.js} Database schema initialization
 */
seedDatabase();
