/**
 * @fileoverview Product Controller for DEX Product Store API
 *
 * This module contains the business logic for all product-related operations.
 * It implements the Controller layer of the MVC pattern, handling the core
 * functionality for product management including CRUD operations, validation,
 * and error handling.
 *
 * Controller Responsibilities:
 * - Handle HTTP requests and responses for product operations
 * - Implement business logic and data validation
 * - Interact with the database through the sql connection
 * - Provide structured error handling and logging
 * - Maintain consistent API response formats
 *
 * Database Schema Context:
 * - Products table: id (SERIAL), name (VARCHAR), price (DECIMAL), image (VARCHAR), created_at (TIMESTAMP)
 * - Uses Neon PostgreSQL with tagged template literals for SQL injection protection
 * - All queries use parameterized statements for security
 *
 * Why this structure: Controllers separate business logic from routing and data access,
 * making the code more maintainable, testable, and following the single responsibility principle.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import { sql } from '../config/db.js';
import logger from '../lib/logger.js';

/**
 * Retrieves all products from the database, ordered by creation date (newest first).
 *
 * This controller function handles the GET /api/products endpoint, providing a complete
 * list of all products in the system. It's used by the frontend to display the product
 * catalog on the homepage and for product management interfaces.
 *
 * Business Logic:
 * - Fetches all products from the database
 * - Orders results by creation date (newest first) for better UX
 * - Returns structured JSON response with success status and data
 * - Logs successful operations for monitoring and debugging
 *
 * Database Query:
 * - Uses SELECT * to retrieve all product fields
 * - ORDER BY created_at DESC ensures newest products appear first
 * - No WHERE clause means all products are returned (no filtering)
 *
 * Error Handling:
 * - Catches database connection or query execution errors
 * - Logs errors with function context for debugging
 * - Returns generic 500 error to avoid exposing internal details
 *
 * Response Format:
 * ```json
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "Product Name",
 *       "price": "99.99",
 *       "image": "https://example.com/image.jpg",
 *       "created_at": "2024-01-01T00:00:00.000Z"
 *     }
 *   ]
 * }
 * ```
 *
 * @async
 * @function getProducts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with products array
 * @throws {Error} Logs database errors and returns 500 status
 */
export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

    logger.debug('Products fetched successfully', { count: products.length });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    logger.error('Error in getProducts function', error, {
      function: 'getProducts',
    });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Creates a new product in the database with validation and error handling.
 *
 * This controller function handles the POST /api/products endpoint, creating new
 * products in the system. It includes input validation to ensure data integrity
 * and returns the newly created product with its assigned ID.
 *
 * Business Logic:
 * - Validates required fields (name, price, image) before database insertion
 * - Uses parameterized queries to prevent SQL injection attacks
 * - Returns the created product with all fields including auto-generated ID
 * - Logs both successful operations and errors for monitoring
 *
 * Input Validation:
 * - Checks that all required fields are present and non-empty
 * - Returns 400 Bad Request if any field is missing
 * - Validates data before attempting database operations
 *
 * Database Operation:
 * - Uses INSERT with RETURNING * to get the complete created record
 * - Parameterized values prevent SQL injection (${name}, ${price}, ${image})
 * - Returns the first (and only) result from the INSERT operation
 *
 * Error Handling:
 * - Validates input before database operations to prevent unnecessary queries
 * - Catches database errors and logs them with product data context
 * - Returns generic 500 error to avoid exposing internal details
 *
 * Request Body:
 * ```json
 * {
 *   "name": "Product Name",
 *   "price": "99.99",
 *   "image": "https://example.com/image.jpg"
 * }
 * ```
 *
 * Response Format:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "name": "Product Name",
 *     "price": "99.99",
 *     "image": "https://example.com/image.jpg",
 *     "created_at": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 * ```
 *
 * @async
 * @function createProduct
 * @param {Object} req - Express request object
 * @param {Object} req.body - Product data from request body
 * @param {string} req.body.name - Product name (required)
 * @param {string} req.body.price - Product price (required)
 * @param {string} req.body.image - Product image URL (required)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with created product or error
 * @throws {Error} Logs validation or database errors and returns appropriate status
 */
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name,price,image)
      VALUES (${name},${price},${image})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    logger.error('Error in createProduct function', error, {
      function: 'createProduct',
      productData: { name, price, image },
    });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Retrieves a specific product by its unique identifier.
 *
 * This controller function handles the GET /api/products/:id endpoint, fetching
 * a single product from the database based on its ID. It's used by the frontend
 * for product detail pages and form pre-filling during editing operations.
 *
 * Business Logic:
 * - Extracts product ID from URL parameters
 * - Queries database for the specific product
 * - Returns the product data or handles not found cases
 * - Logs operations for monitoring and debugging
 *
 * Database Query:
 * - Uses parameterized WHERE clause to prevent SQL injection
 * - SELECT * retrieves all product fields
 * - Returns first result (should be unique due to primary key)
 *
 * Error Handling:
 * - Catches database connection or query execution errors
 * - Logs errors with product ID context for debugging
 * - Returns generic 500 error to avoid exposing internal details
 * - Note: Does not explicitly handle "not found" case (returns undefined)
 *
 * URL Parameters:
 * - id (number): The unique identifier of the product to retrieve
 *
 * Response Format:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "name": "Product Name",
 *     "price": "99.99",
 *     "image": "https://example.com/image.jpg",
 *     "created_at": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 * ```
 *
 * @async
 * @function getProduct
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Product ID from URL path
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with product data or error
 * @throws {Error} Logs database errors and returns 500 status
 */
export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
     SELECT * FROM products WHERE id=${id}
    `;

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    logger.error('Error in getProduct function', error, {
      function: 'getProduct',
      productId: id,
    });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Updates an existing product with new data, performing complete replacement.
 *
 * This controller function handles the PUT /api/products/:id endpoint, updating
 * a product's information in the database. It performs a complete replacement
 * of the product data and includes proper validation for non-existent products.
 *
 * Business Logic:
 * - Extracts product ID from URL parameters and new data from request body
 * - Performs UPDATE operation with complete data replacement
 * - Validates that the product exists before returning success
 * - Returns the updated product data for frontend state synchronization
 *
 * Database Operation:
 * - Uses UPDATE with SET clause to modify all product fields
 * - WHERE clause targets the specific product by ID
 * - RETURNING * retrieves the updated record
 * - Parameterized values prevent SQL injection attacks
 *
 * Validation Logic:
 * - Checks if any rows were affected by the UPDATE operation
 * - Returns 404 Not Found if no product exists with the given ID
 * - This prevents silent failures when updating non-existent products
 *
 * Error Handling:
 * - Catches database connection or query execution errors
 * - Logs errors with product ID and update data context
 * - Returns appropriate HTTP status codes (404 for not found, 500 for errors)
 *
 * URL Parameters:
 * - id (number): The unique identifier of the product to update
 *
 * Request Body:
 * ```json
 * {
 *   "name": "Updated Product Name",
 *   "price": "149.99",
 *   "image": "https://example.com/new-image.jpg"
 * }
 * ```
 *
 * Response Format:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "name": "Updated Product Name",
 *     "price": "149.99",
 *     "image": "https://example.com/new-image.jpg",
 *     "created_at": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 * ```
 *
 * @async
 * @function updateProduct
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Product ID from URL path
 * @param {Object} req.body - Updated product data from request body
 * @param {string} req.body.name - New product name
 * @param {string} req.body.price - New product price
 * @param {string} req.body.image - New product image URL
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with updated product or error
 * @throws {Error} Logs database errors and returns appropriate status
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updateProduct = await sql`
      UPDATE products
      SET name=${name}, price=${price}, image=${image}
      WHERE id=${id}
      RETURNING *
    `;

    if (updateProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({ success: true, data: updateProduct[0] });
  } catch (error) {
    logger.error('Error in updateProduct function', error, {
      function: 'updateProduct',
      productId: id,
      updateData: { name, price, image },
    });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Permanently deletes a product from the database with validation.
 *
 * This controller function handles the DELETE /api/products/:id endpoint, removing
 * a product from the database. It includes validation to ensure the product exists
 * before deletion and returns the deleted product data for confirmation.
 *
 * Business Logic:
 * - Extracts product ID from URL parameters
 * - Performs DELETE operation with RETURNING clause to get deleted data
 * - Validates that the product existed before deletion
 * - Returns the deleted product data for frontend state updates
 *
 * Database Operation:
 * - Uses DELETE with WHERE clause to target specific product
 * - RETURNING * retrieves the deleted record before removal
 * - Parameterized ID prevents SQL injection attacks
 * - Returns array of deleted records (should be 0 or 1)
 *
 * Validation Logic:
 * - Checks if any rows were affected by the DELETE operation
 * - Returns 404 Not Found if no product exists with the given ID
 * - This prevents silent failures when deleting non-existent products
 *
 * Error Handling:
 * - Catches database connection or query execution errors
 * - Logs errors with product ID context for debugging
 * - Returns appropriate HTTP status codes (404 for not found, 500 for errors)
 *
 * URL Parameters:
 * - id (number): The unique identifier of the product to delete
 *
 * Response Format (Success):
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "name": "Deleted Product Name",
 *     "price": "99.99",
 *     "image": "https://example.com/image.jpg",
 *     "created_at": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 * ```
 *
 * Response Format (Not Found):
 * ```json
 * {
 *   "success": false,
 *   "message": "Product not found"
 * }
 * ```
 *
 * @async
 * @function deleteProduct
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Product ID from URL path
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with deleted product or error
 * @throws {Error} Logs database errors and returns appropriate status
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id=${id} RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    logger.error('Error in deleteProduct function', error, {
      function: 'deleteProduct',
      productId: id,
    });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
