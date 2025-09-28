/**
 * @fileoverview HomePage Component - Main Product Catalog and Management Interface
 *
 * This is the primary page component of the DEX Product Store application,
 * serving as the main product catalog and management interface. It provides
 * a comprehensive view of all products with CRUD operations, loading states,
 * error handling, and empty state management.
 *
 * Component Responsibilities:
 * - Display product catalog in a responsive grid layout
 * - Provide product management actions (add, refresh, delete)
 * - Handle loading states and error display
 * - Show empty state when no products exist
 * - Integrate with global state management
 *
 * Page Architecture:
 * - Header: Action buttons (Add Product, Refresh)
 * - Modal: AddProductModal for product creation
 * - Content: Product grid or empty/loading states
 * - Error Handling: Alert display for API errors
 *
 * State Management Integration:
 * - Uses useProductStore for global product state
 * - Fetches products on component mount
 * - Displays loading, error, and success states
 * - Integrates with CRUD operations
 *
 * Why this structure: The HomePage follows the container pattern where it
 * orchestrates the product management workflow while delegating specific
 * functionality to specialized components like ProductCard and AddProductModal.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * React useEffect hook for side effects and lifecycle management.
 *
 * useEffect is React's primary hook for handling side effects like
 * data fetching, subscriptions, and DOM manipulation. It runs after
 * the component renders and can be configured to run on specific
 * dependencies or only once.
 *
 * Why useEffect here: We need to fetch products when the component
 * mounts, which is a side effect that should happen after rendering.
 *
 * @see {@link https://react.dev/reference/react/useEffect} React useEffect Documentation
 */
import { useEffect } from 'react';

/**
 * Product store hook for global state management.
 *
 * useProductStore provides access to the global product state including:
 * - products: Array of all products from the API
 * - loading: Boolean indicating if async operations are in progress
 * - error: String containing error messages from failed operations
 * - fetchProducts: Function to retrieve products from the API
 *
 * Why global state: Product data needs to be shared across multiple
 * components (HomePage, ProductCard, AddProductModal, ProductPage).
 * Global state ensures data consistency and eliminates prop drilling.
 *
 * @see {@link ../store/useProductStore} Product store implementation
 */
import { useProductStore } from '../store/useProductStore';

/**
 * Lucide React icons for UI elements and visual indicators.
 *
 * Lucide React provides a comprehensive set of beautiful, customizable
 * SVG icons that are optimized for React applications. These icons
 * enhance the user interface with clear visual indicators.
 *
 * Icons Used:
 * - PackageIcon: Empty state indicator for no products
 * - PlusCircleIcon: Add product button and modal actions
 * - RefreshCwIcon: Refresh products button
 *
 * Why Lucide React:
 * - Consistent design language across all icons
 * - Lightweight and tree-shakeable
 * - Excellent TypeScript support
 * - Customizable size, color, and styling
 *
 * @see {@link https://lucide.dev/} Lucide Icons Documentation
 */
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from 'lucide-react';

/**
 * ProductCard component for displaying individual products.
 *
 * ProductCard renders a single product in a card format with:
 * - Product image with aspect ratio preservation
 * - Product name and formatted price
 * - Edit and delete action buttons
 * - Hover effects and transitions
 *
 * Props Interface:
 * - product: Object containing product data (id, name, price, image, created_at)
 *
 * Why separate component: ProductCard encapsulates the product display
 * logic and can be reused in different contexts. It also keeps the
 * HomePage component focused on layout and state management.
 *
 * @see {@link ../components/ProductCard} ProductCard component implementation
 */
import ProductCard from '../components/ProductCard';

/**
 * AddProductModal component for product creation.
 *
 * AddProductModal provides a modal interface for creating new products with:
 * - Form inputs for product name, price, and image URL
 * - Form validation and loading states
 * - Integration with global product state
 * - Modal backdrop and close functionality
 *
 * Why modal approach: Modals provide a focused, non-disruptive way to
 * collect form data without navigating away from the main product list.
 * This maintains context and provides better user experience.
 *
 * @see {@link ../components/AddProductModal} AddProductModal component implementation
 */
import AddProductModal from '../components/AddProductModal';

/**
 * HomePage component - Main product catalog and management interface.
 *
 * This component serves as the primary page for the DEX Product Store,
 * providing a comprehensive product management interface with CRUD
 * operations, loading states, error handling, and responsive design.
 *
 * Component Structure:
 * - Header: Action buttons for adding products and refreshing data
 * - Modal: AddProductModal for product creation
 * - Content: Product grid, loading state, or empty state
 * - Error Handling: Alert display for API errors
 *
 * State Management:
 * - Uses useProductStore for global product state
 * - Fetches products on component mount
 * - Displays loading, error, and success states
 * - Integrates with CRUD operations
 *
 * User Experience:
 * - Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
 * - Loading indicators during async operations
 * - Error alerts for failed operations
 * - Empty state with call-to-action
 * - Smooth transitions and hover effects
 *
 * @returns {JSX.Element} The main product catalog interface
 */
function HomePage() {
  /**
   * Global product state from Zustand store.
   *
   * This destructuring extracts the necessary state and actions from
   * the global product store. The HomePage component needs access to
   * the products array, loading state, error state, and fetchProducts
   * function to manage the product catalog display.
   *
   * State Properties:
   * - products: Array of product objects from the API
   * - loading: Boolean indicating if async operations are in progress
   * - error: String containing error messages from failed operations
   * - fetchProducts: Function to retrieve products from the API
   *
   * Why destructure here: Only the needed properties are extracted
   * to keep the component focused and avoid unnecessary re-renders
   * when unrelated state changes.
   */
  const { products, loading, error, fetchProducts } = useProductStore();

  /**
   * Effect hook to fetch products when component mounts.
   *
   * This useEffect runs after the component renders and fetches the
   * complete list of products from the API. It's essential for
   * populating the product catalog when the user first visits the page.
   *
   * Dependencies:
   * - fetchProducts: Function reference from the store
   * - Empty dependency array would cause infinite re-renders
   * - fetchProducts is stable from Zustand store
   *
   * Why useEffect: Data fetching is a side effect that should happen
   * after rendering, not during the render phase. useEffect ensures
   * this happens at the right time in the component lifecycle.
   *
   * @see {@link https://react.dev/reference/react/useEffect} React useEffect Documentation
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 ">
      {/*
        Header Section - Action Buttons
        ================================
        
        This section provides the primary actions for product management:
        1. Add Product Button: Opens the AddProductModal for creating new products
        2. Refresh Button: Manually refreshes the product list from the API
        
        Why this layout:
        - Flexbox with justify-between creates balanced spacing
        - Primary action (Add Product) is more prominent
        - Secondary action (Refresh) is subtle but accessible
        - Icons provide clear visual indicators
      */}
      <div className="flex justify-between items-center mb-8">
        <button
          className="btn btn-primary"
          onClick={() =>
            document.getElementById('add_product_modal').showModal()
          }
        >
          <PlusCircleIcon className="size-5 mr-2" />
          Add Product
        </button>
        <button className="btn btn-ghost btn-circle" onClick={fetchProducts}>
          <RefreshCwIcon className="size-5" />
        </button>
      </div>

      {/*
        AddProductModal Component
        =========================
        
        This modal component handles product creation with a form interface.
        It's rendered here but controlled by the Add Product button above.
        
        Why render here: The modal needs to be in the DOM to be controlled
        by the button, but it's conceptually part of the product management
        workflow that starts on the HomePage.
      */}
      <AddProductModal />

      {/*
        Error Display
        =============
        
        This conditional rendering shows error alerts when API operations fail.
        The error state is managed by the product store and displayed here
        to provide user feedback about what went wrong.
        
        Why conditional rendering: Errors should only be shown when they exist.
        This prevents empty error containers from taking up space in the UI.
      */}
      {error && <div className="alert alert-error mb-8">{error}</div>}

      {/*
        Empty State
        ===========
        
        This section displays when there are no products and no loading is
        happening. It provides a friendly message and visual indicator to
        encourage users to add their first product.
        
        Why empty state: Empty states are crucial for good UX. They explain
        why the page is empty and provide a clear next action for users.
        
        Design considerations:
        - Centered layout with adequate spacing
        - Icon provides visual interest
        - Clear messaging explains the situation
        - Call-to-action encourages user engagement
      */}
      {products.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold ">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              Get started by adding your first product to the inventory
            </p>
          </div>
        </div>
      )}

      {/*
        Loading State
        =============
        
        This section displays a loading spinner when products are being
        fetched from the API. It provides visual feedback that something
        is happening and prevents user confusion.
        
        Why loading state: Users need to know when async operations are
        in progress. Loading states improve perceived performance and
        provide clear feedback about the application's state.
      */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        /*
          Product Grid
          ============
          
          This section displays the product catalog in a responsive grid layout.
          Each product is rendered as a ProductCard component with its data.
          
          Grid Layout:
          - Mobile: 1 column (grid-cols-1)
          - Tablet: 2 columns (md:grid-cols-2)
          - Desktop: 3 columns (lg:grid-cols-3)
          - Gap: 6 units between grid items
          
          Why responsive grid: Different screen sizes need different layouts
          to optimize space usage and readability. The grid adapts to provide
          the best experience on each device type.
          
          Key mapping: Each product needs a unique key for React's
          reconciliation algorithm to work efficiently.
        */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;
