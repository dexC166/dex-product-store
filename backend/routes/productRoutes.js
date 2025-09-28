/**
 * @fileoverview Product Routes for DEX Product Store API
 *
 * This module defines the RESTful API routes for product management operations.
 * It provides a complete CRUD (Create, Read, Update, Delete) interface for products
 * that is consumed by the frontend React application.
 *
 * Route Structure:
 * - All routes are mounted at '/api/products' in the main server
 * - Follows RESTful conventions for predictable API design
 * - Each route is protected by Arcjet security middleware
 * - Routes delegate business logic to dedicated controller functions
 *
 * API Endpoints:
 * - GET /api/products - Retrieve all products (with pagination support)
 * - GET /api/products/:id - Retrieve a specific product by ID
 * - POST /api/products - Create a new product
 * - PUT /api/products/:id - Update an existing product
 * - DELETE /api/products/:id - Delete a product
 *
 * Why this structure: Separating routes from controllers follows the MVC pattern
 * and makes the code more maintainable, testable, and scalable.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';

/**
 * Express router instance for product-related routes.
 *
 * This router will be mounted at '/api/products' in the main server, creating
 * the complete product management API. The router handles HTTP method routing
 * and delegates the actual business logic to controller functions.
 *
 * Security Context: All routes defined on this router are automatically protected
 * by the Arcjet middleware when mounted in the main server. This provides:
 * - Rate limiting (30 requests per 5 seconds per IP)
 * - Bot detection and blocking
 * - Attack protection (SQL injection, XSS, CSRF)
 *
 * @type {express.Router} Express router instance for product routes
 */
const router = express.Router();

/**
 * GET /api/products - Retrieve all products
 *
 * This endpoint returns a list of all products in the database, ordered by
 * creation date (newest first). It's used by the frontend to display the
 * product catalog on the homepage.
 *
 * Frontend Usage:
 * - Called by useProductStore.fetchProducts() on homepage load
 * - Used to populate the product grid in HomePage.jsx
 * - Supports real-time updates when products are added/modified
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
 * Why GET /: This follows REST conventions where GET requests are used for
 * retrieving data without side effects. The endpoint is idempotent and safe.
 *
 * @route GET /
 * @access Public (but rate limited)
 * @returns {Object} JSON response with products array
 */
router.get('/', getProducts);

/**
 * GET /api/products/:id - Retrieve a specific product by ID
 *
 * This endpoint returns a single product based on its unique identifier.
 * It's used by the frontend to display individual product details and
 * populate edit forms.
 *
 * Frontend Usage:
 * - Called by useProductStore.fetchProduct(id) for product detail pages
 * - Used in ProductPage.jsx to display and edit individual products
 * - Pre-fills form data for product editing
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
 * Error Handling:
 * - 404: Product not found
 * - 500: Database or server error
 *
 * Why GET /:id: This follows REST conventions for retrieving a specific
 * resource by its identifier. The colon syntax indicates a route parameter.
 *
 * @route GET /:id
 * @access Public (but rate limited)
 * @param {number} id - Product ID in URL path
 * @returns {Object} JSON response with single product or error
 */
router.get('/:id', getProduct);

/**
 * POST /api/products - Create a new product
 *
 * This endpoint creates a new product in the database. It validates the
 * required fields and returns the newly created product with its assigned ID.
 *
 * Frontend Usage:
 * - Called by useProductStore.addProduct() when submitting the add product form
 * - Used in AddProductModal.jsx for creating new products
 * - Automatically refreshes the product list after creation
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
 * Validation:
 * - All fields (name, price, image) are required
 * - Returns 400 Bad Request if any field is missing
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
 * Why POST /: This follows REST conventions where POST requests are used for
 * creating new resources. The endpoint is not idempotent (multiple calls create
 * multiple products).
 *
 * @route POST /
 * @access Public (but rate limited)
 * @param {Object} body - Product data in request body
 * @returns {Object} JSON response with created product or error
 */
router.post('/', createProduct);

/**
 * PUT /api/products/:id - Update an existing product
 *
 * This endpoint updates an existing product with new data. It performs a
 * complete replacement of the product data and returns the updated product.
 *
 * Frontend Usage:
 * - Called by useProductStore.updateProduct(id) when saving product edits
 * - Used in ProductPage.jsx for updating product information
 * - Updates the current product state after successful update
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
 * Error Handling:
 * - 404: Product not found
 * - 500: Database or server error
 *
 * Why PUT /:id: This follows REST conventions where PUT requests are used for
 * updating existing resources. The endpoint is idempotent (multiple calls with
 * the same data have the same effect).
 *
 * @route PUT /:id
 * @access Public (but rate limited)
 * @param {number} id - Product ID in URL path
 * @param {Object} body - Updated product data in request body
 * @returns {Object} JSON response with updated product or error
 */
router.put('/:id', updateProduct);

/**
 * DELETE /api/products/:id - Delete a product
 *
 * This endpoint permanently removes a product from the database. It returns
 * the deleted product data for confirmation and frontend state updates.
 *
 * Frontend Usage:
 * - Called by useProductStore.deleteProduct(id) when deleting products
 * - Used in ProductCard.jsx and ProductPage.jsx for product deletion
 * - Removes the product from the frontend state after successful deletion
 * - Shows confirmation dialog before deletion
 *
 * URL Parameters:
 * - id (number): The unique identifier of the product to delete
 *
 * Response Format:
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
 * Error Handling:
 * - 404: Product not found
 * - 500: Database or server error
 *
 * Why DELETE /:id: This follows REST conventions where DELETE requests are used
 * for removing resources. The endpoint is idempotent (deleting a non-existent
 * product has no effect).
 *
 * @route DELETE /:id
 * @access Public (but rate limited)
 * @param {number} id - Product ID in URL path
 * @returns {Object} JSON response with deleted product or error
 */
router.delete('/:id', deleteProduct);

/**
 * Export the configured router for mounting in the main server.
 *
 * This router will be mounted at '/api/products' in server.js, creating
 * the complete product management API with all CRUD operations.
 *
 * Mounting Context:
 * ```javascript
 * app.use('/api/products', productRoutes);
 * ```
 *
 * This creates the following API endpoints:
 * - GET /api/products
 * - GET /api/products/:id
 * - POST /api/products
 * - PUT /api/products/:id
 * - DELETE /api/products/:id
 *
 * @type {express.Router} Configured Express router with all product routes
 */
export default router;
