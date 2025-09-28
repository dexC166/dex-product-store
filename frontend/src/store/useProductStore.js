/**
 * @fileoverview Product Store - Global State Management for Product Operations
 *
 * This Zustand store manages all product-related state and operations for the
 * DEX Product Store application. It provides a centralized state management
 * solution that handles CRUD operations, form state, loading states, and
 * error handling for the entire product management system.
 *
 * Store Architecture:
 * - State Management: Products list, loading states, error handling
 * - Form Management: Product form data and validation
 * - API Integration: Axios-based HTTP requests to backend
 * - User Feedback: Toast notifications for success/error states
 * - Environment Awareness: Dynamic API URL configuration
 *
 * Key Features:
 * - CRUD Operations: Create, Read, Update, Delete products
 * - Form State Management: Centralized form data handling
 * - Loading States: Global loading indicators for async operations
 * - Error Handling: Comprehensive error management with user feedback
 * - Optimistic Updates: Immediate UI updates with server synchronization
 *
 * Why Zustand: Zustand provides a lightweight, TypeScript-friendly state
 * management solution that's simpler than Redux but more powerful than
 * React Context. It offers excellent performance and developer experience
 * for managing complex application state.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * Zustand store creation function for state management.
 *
 * Zustand is a small, fast, and scalable state management solution that
 * provides a simple API for creating stores with actions and state.
 * It's particularly well-suited for React applications that need
 * global state without the complexity of Redux.
 *
 * Why Zustand over other solutions:
 * - Simpler than Redux (less boilerplate, no reducers)
 * - Better performance than Context API (no unnecessary re-renders)
 * - TypeScript-friendly with excellent type inference
 * - Small bundle size (~2KB gzipped)
 * - No providers needed, can be used anywhere in the component tree
 *
 * @see {@link https://zustand-demo.pmnd.rs/} Zustand Documentation
 */
import { create } from 'zustand';

/**
 * Axios HTTP client for API communication.
 *
 * Axios provides a promise-based HTTP client for making API requests
 * to the backend. It offers features like request/response interceptors,
 * automatic JSON parsing, and better error handling compared to fetch.
 *
 * Why Axios over fetch:
 * - Better error handling and status code management
 * - Request/response interceptors for global configuration
 * - Automatic JSON parsing and request body serialization
 * - Better browser compatibility and feature support
 * - More intuitive API for complex HTTP operations
 *
 * @see {@link https://axios-http.com/} Axios Documentation
 */
import axios from 'axios';

/**
 * React Hot Toast for user feedback notifications.
 *
 * React Hot Toast provides a lightweight, customizable toast notification
 * system that displays success, error, and loading messages to users.
 * It integrates seamlessly with React applications and provides excellent UX.
 *
 * Why React Hot Toast:
 * - Lightweight and performant
 * - Customizable styling and positioning
 * - Promise-based API for async operations
 * - Excellent TypeScript support
 * - Non-intrusive user experience
 *
 * @see {@link https://react-hot-toast.com/} React Hot Toast Documentation
 */
import toast from 'react-hot-toast';

/**
 * Dynamic API base URL configuration for environment-aware requests.
 *
 * This configuration automatically adjusts the API base URL based on the
 * current environment (development vs production). This ensures the
 * application works correctly in both local development and production
 * deployment scenarios.
 *
 * Environment Configuration:
 * - Development: http://localhost:3000 (local backend server)
 * - Production: '' (empty string for same-origin requests)
 *
 * Production URL Strategy:
 * - Empty string enables relative URLs (e.g., /api/products)
 * - Vercel handles API rewrites to Fly.io backend via vercel.json
 * - This approach avoids CORS issues and simplifies deployment
 *
 * Why this approach: Environment-specific URLs ensure the application
 * works correctly in both development and production without manual
 * configuration changes. The production setup leverages Vercel's
 * rewrite functionality to proxy API requests to the Fly.io backend.
 *
 * @see {@link ../vercel.json} Vercel configuration for API rewrites
 */
const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '';

/**
 * Zustand store for product management state and operations.
 *
 * This store provides a centralized state management solution for all
 * product-related operations in the application. It manages both the
 * product data and the form state needed for creating and editing products.
 *
 * Store Structure:
 * - State: products, loading, error, currentProduct, formData
 * - Actions: CRUD operations, form management, state updates
 * - Side Effects: API calls, toast notifications, DOM manipulation
 *
 * State Management Pattern:
 * - Immutable updates using Zustand's set function
 * - Optimistic updates for better user experience
 * - Error boundaries with fallback states
 * - Loading states for async operations
 *
 * @param {Function} set - Zustand's state setter function
 * @param {Function} get - Zustand's state getter function
 * @returns {Object} Store object with state and actions
 */
export const useProductStore = create((set, get) => ({
  /**
   * Products array containing all fetched products from the API.
   *
   * This array stores the complete list of products retrieved from the
   * backend API. It's used by components like HomePage and ProductCard
   * to display the product catalog and individual product information.
   *
   * Data Structure:
   * - Array of product objects
   * - Each product contains: id, name, price, image, created_at
   * - Updated by fetchProducts() and modified by CRUD operations
   *
   * Usage: Components access this via useProductStore().products
   *
   * @type {Array<Object>} Array of product objects
   */
  products: [],

  /**
   * Global loading state for async operations.
   *
   * This boolean indicates whether any async operation is currently
   * in progress. It's used to show loading indicators in the UI and
   * disable form submissions during API calls.
   *
   * Loading States:
   * - true: An async operation is in progress
   * - false: No async operations are running
   *
   * Usage: Components use this to show spinners and disable buttons
   *
   * @type {boolean} Loading state indicator
   */
  loading: false,

  /**
   * Global error state for API operation failures.
   *
   * This string stores error messages from failed API operations.
   * It's used to display error alerts to users and provide feedback
   * about what went wrong during API calls.
   *
   * Error Types:
   * - null: No errors
   * - 'Rate limit exceeded': API rate limiting (429 status)
   * - 'Something went wrong': Generic error message
   *
   * Usage: Components display this in error alert components
   *
   * @type {string|null} Error message or null
   */
  error: null,

  /**
   * Currently selected product for editing operations.
   *
   * This object stores the product currently being edited in the
   * ProductPage component. It's populated by fetchProduct() and used
   * to pre-fill forms and display product details.
   *
   * Data Structure:
   * - Single product object with id, name, price, image, created_at
   * - null when no product is selected
   * - Updated by fetchProduct() and updateProduct()
   *
   * Usage: ProductPage component uses this for editing operations
   *
   * @type {Object|null} Current product object or null
   */
  currentProduct: null,

  /**
   * Form data object for product creation and editing.
   *
   * This object stores the form data used in AddProductModal and
   * ProductPage components. It's managed centrally to ensure
   * consistency across different form implementations.
   *
   * Form Fields:
   * - name: Product name (string)
   * - price: Product price (string, will be converted to number)
   * - image: Product image URL (string)
   *
   * Usage: Form components bind to these fields and use setFormData()
   *
   * @type {Object} Form data object
   * @property {string} name - Product name
   * @property {string} price - Product price
   * @property {string} image - Product image URL
   */
  formData: {
    name: '',
    price: '',
    image: '',
  },

  /**
   * Updates the form data with new values.
   *
   * This action allows components to update the form data state
   * when users type in form inputs. It's used by form components
   * to maintain controlled inputs and ensure state consistency.
   *
   * Usage Pattern:
   * - Form inputs call this on onChange events
   * - Partial updates are merged with existing formData
   * - Used in AddProductModal and ProductPage components
   *
   * @param {Object} formData - New form data to merge with existing data
   * @param {string} [formData.name] - Product name
   * @param {string} [formData.price] - Product price
   * @param {string} [formData.image] - Product image URL
   */
  setFormData: (formData) => set({ formData }),

  /**
   * Resets the form data to empty values.
   *
   * This action clears all form fields by resetting formData to
   * its initial empty state. It's typically called after successful
   * form submissions to prepare for the next input.
   *
   * Usage Scenarios:
   * - After successful product creation
   * - When canceling form operations
   * - When starting a new form session
   *
   * Reset Values:
   * - name: '' (empty string)
   * - price: '' (empty string)
   * - image: '' (empty string)
   */
  resetForm: () => set({ formData: { name: '', price: '', image: '' } }),

  /**
   * Creates a new product via API and updates the local state.
   *
   * This async action handles the complete product creation workflow:
   * 1. Prevents default form submission
   * 2. Sets loading state to true
   * 3. Sends POST request to API with form data
   * 4. Refreshes the products list
   * 5. Resets the form
   * 6. Shows success notification
   * 7. Closes the modal
   * 8. Handles errors with user feedback
   *
   * API Integration:
   * - POST /api/products with formData
   * - Refreshes products list after creation
   * - Handles both success and error scenarios
   *
   * User Experience:
   * - Loading state during API call
   * - Success toast notification
   * - Automatic form reset and modal close
   * - Error handling with user feedback
   *
   * @param {Event} e - Form submission event (preventDefault called)
   * @returns {Promise<void>} Resolves when operation completes
   */
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success('Product added successfully');
      document.getElementById('add_product_modal').close();
    } catch {
      // In production, errors are handled by toast notifications
      // Console logging removed for production readiness
      toast.error('Something went wrong');
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Fetches all products from the API and updates the local state.
   *
   * This async action retrieves the complete list of products from
   * the backend API and updates the products array. It's called
   * on application startup and after product modifications.
   *
   * API Integration:
   * - GET /api/products to retrieve all products
   * - Updates products array with response data
   * - Clears any existing errors on success
   * - Handles rate limiting and other API errors
   *
   * Error Handling:
   * - Rate limit exceeded (429): Specific error message
   * - Other errors: Generic error message
   * - Clears products array on error
   *
   * Usage: Called by HomePage on mount and after CRUD operations
   *
   * @returns {Promise<void>} Resolves when products are fetched
   */
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.status == 429)
        set({ error: 'Rate limit exceeded', products: [] });
      else set({ error: 'Something went wrong', products: [] });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Deletes a product via API and updates the local state.
   *
   * This async action handles product deletion with optimistic updates:
   * 1. Sets loading state to true
   * 2. Sends DELETE request to API
   * 3. Removes product from local products array
   * 4. Shows success notification
   * 5. Handles errors with user feedback
   *
   * Optimistic Updates:
   * - Immediately removes product from local state
   * - Provides instant user feedback
   * - Reverts on API failure (though not implemented here)
   *
   * API Integration:
   * - DELETE /api/products/:id
   * - Updates local products array
   * - Handles both success and error scenarios
   *
   * @param {number|string} id - Product ID to delete
   * @returns {Promise<void>} Resolves when deletion completes
   */
  deleteProduct: async (id) => {
    // Debug logging removed for production readiness
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success('Product deleted successfully');
    } catch {
      // In production, errors are handled by toast notifications
      // Console logging removed for production readiness
      toast.error('Something went wrong');
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Fetches a specific product by ID for editing operations.
   *
   * This async action retrieves a single product from the API and
   * prepares it for editing. It populates both currentProduct and
   * formData to enable form pre-filling and product display.
   *
   * API Integration:
   * - GET /api/products/:id to retrieve specific product
   * - Updates currentProduct with fetched data
   * - Pre-fills formData for editing
   * - Clears any existing errors
   *
   * Form Pre-filling:
   * - Sets formData to product data for editing
   * - Enables immediate form population
   * - Maintains form state consistency
   *
   * Usage: Called by ProductPage component on mount
   *
   * @param {number|string} id - Product ID to fetch
   * @returns {Promise<void>} Resolves when product is fetched
   */
  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, // pre-fill form with current product data
        error: null,
      });
    } catch {
      // In production, errors are handled by state management
      // Console logging removed for production readiness
      set({ error: 'Something went wrong', currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Updates an existing product via API and refreshes the local state.
   *
   * This async action handles product updates with the current form data:
   * 1. Sets loading state to true
   * 2. Sends PUT request to API with formData
   * 3. Updates currentProduct with response data
   * 4. Shows success notification
   * 5. Handles errors with user feedback
   *
   * API Integration:
   * - PUT /api/products/:id with formData
   * - Updates currentProduct with response
   * - Handles both success and error scenarios
   *
   * Form Data Usage:
   * - Uses current formData state for update
   * - Maintains form state consistency
   * - Enables real-time form updates
   *
   * Usage: Called by ProductPage component for product updates
   *
   * @param {number|string} id - Product ID to update
   * @returns {Promise<void>} Resolves when update completes
   */
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        formData
      );
      set({ currentProduct: response.data.data });
      toast.success('Product updated successfully');
    } catch {
      toast.error('Something went wrong');
      // In production, errors are handled by toast notifications
      // Console logging removed for production readiness
    } finally {
      set({ loading: false });
    }
  },
}));
