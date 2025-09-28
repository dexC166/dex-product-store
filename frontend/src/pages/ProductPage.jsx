/**
 * @fileoverview ProductPage Component - Individual Product Management Interface
 *
 * This is a dynamic page component of the DEX Product Store application,
 * serving as the individual product management interface. It provides
 * a comprehensive view for editing, updating, and deleting specific
 * products with form-based interactions and CRUD operations.
 *
 * Component Responsibilities:
 * - Display individual product details and image
 * - Provide form-based product editing interface
 * - Handle product updates and deletions
 * - Manage loading states and error handling
 * - Provide navigation back to product catalog
 *
 * Page Architecture:
 * - Header: Back navigation button
 * - Content: Two-column layout (image + form)
 * - Form: Product editing with validation
 * - Actions: Update and delete buttons
 *
 * Routing Integration:
 * - Dynamic route: /product/:id
 * - Uses useParams to extract product ID
 * - Uses useNavigate for programmatic navigation
 * - Integrates with React Router for SPA behavior
 *
 * State Management Integration:
 * - Uses useProductStore for global product state
 * - Fetches specific product on component mount
 * - Manages form state and CRUD operations
 * - Handles loading, error, and success states
 *
 * Why this structure: The ProductPage follows the detail page pattern
 * where it focuses on a single resource (product) and provides
 * comprehensive management capabilities for that resource.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * React Router hooks for navigation and route parameters.
 *
 * React Router provides hooks for programmatic navigation and accessing
 * route parameters in functional components. These hooks enable
 * client-side routing without full page reloads.
 *
 * Hooks Used:
 * - useNavigate: Programmatic navigation between routes
 * - useParams: Access to dynamic route parameters
 *
 * Why React Router: Enables Single Page Application (SPA) behavior
 * where navigation happens client-side, providing better user
 * experience and performance compared to traditional multi-page
 * applications.
 *
 * @see {@link https://reactrouter.com/en/main} React Router Documentation
 */
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Product store hook for global state management.
 *
 * useProductStore provides access to the global product state including:
 * - currentProduct: Currently selected product for editing
 * - formData: Form state for product editing
 * - setFormData: Function to update form state
 * - loading: Boolean indicating if async operations are in progress
 * - error: String containing error messages from failed operations
 * - fetchProduct: Function to retrieve specific product by ID
 * - updateProduct: Function to update product via API
 * - deleteProduct: Function to delete product via API
 *
 * Why global state: Product data needs to be shared across multiple
 * components and operations. Global state ensures data consistency
 * and eliminates prop drilling for complex state management.
 *
 * @see {@link ../store/useProductStore} Product store implementation
 */
import { useProductStore } from '../store/useProductStore';

/**
 * React useEffect hook for side effects and lifecycle management.
 *
 * useEffect is React's primary hook for handling side effects like
 * data fetching, subscriptions, and DOM manipulation. It runs after
 * the component renders and can be configured to run on specific
 * dependencies or only once.
 *
 * Why useEffect here: We need to fetch the specific product when
 * the component mounts, which is a side effect that should happen
 * after rendering.
 *
 * @see {@link https://react.dev/reference/react/useEffect} React useEffect Documentation
 */
import { useEffect } from 'react';

/**
 * Lucide React icons for UI elements and visual indicators.
 *
 * Lucide React provides a comprehensive set of beautiful, customizable
 * SVG icons that are optimized for React applications. These icons
 * enhance the user interface with clear visual indicators.
 *
 * Icons Used:
 * - ArrowLeftIcon: Back navigation button
 * - SaveIcon: Save changes button
 * - Trash2Icon: Delete product button
 *
 * Why Lucide React:
 * - Consistent design language across all icons
 * - Lightweight and tree-shakeable
 * - Excellent TypeScript support
 * - Customizable size, color, and styling
 *
 * @see {@link https://lucide.dev/} Lucide Icons Documentation
 */
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from 'lucide-react';

/**
 * ProductPage component - Individual product management interface.
 *
 * This component serves as the detail page for individual product
 * management, providing comprehensive editing capabilities with
 * form-based interactions and CRUD operations.
 *
 * Component Structure:
 * - Header: Back navigation button
 * - Content: Two-column responsive layout
 * - Image: Product image display
 * - Form: Product editing interface
 * - Actions: Update and delete buttons
 *
 * Routing Integration:
 * - Dynamic route: /product/:id
 * - Extracts product ID from URL parameters
 * - Provides programmatic navigation back to catalog
 *
 * State Management:
 * - Uses useProductStore for global product state
 * - Fetches specific product on component mount
 * - Manages form state and CRUD operations
 * - Handles loading, error, and success states
 *
 * User Experience:
 * - Responsive two-column layout (image + form)
 * - Loading indicators during async operations
 * - Error alerts for failed operations
 * - Form validation and disabled states
 * - Confirmation dialogs for destructive actions
 *
 * @returns {JSX.Element} The individual product management interface
 */
function ProductPage() {
  /**
   * Global product state from Zustand store.
   *
   * This destructuring extracts the necessary state and actions from
   * the global product store. The ProductPage component needs access
   * to the current product, form data, loading state, error state,
   * and CRUD operations to manage individual product editing.
   *
   * State Properties:
   * - currentProduct: Currently selected product object
   * - formData: Form state for product editing
   * - setFormData: Function to update form state
   * - loading: Boolean indicating if async operations are in progress
   * - error: String containing error messages from failed operations
   * - fetchProduct: Function to retrieve specific product by ID
   * - updateProduct: Function to update product via API
   * - deleteProduct: Function to delete product via API
   *
   * Why destructure here: Only the needed properties are extracted
   * to keep the component focused and avoid unnecessary re-renders
   * when unrelated state changes.
   */
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  /**
   * React Router navigation hook for programmatic navigation.
   *
   * useNavigate provides a function to programmatically navigate
   * between routes without using Link components. This is useful
   * for navigation triggered by user actions or after async operations.
   *
   * Usage: navigate('/') navigates back to the homepage
   *
   * Why programmatic navigation: After deleting a product, we want
   * to automatically navigate back to the product catalog to provide
   * immediate feedback and prevent the user from staying on a page
   * with a deleted product.
   */
  const navigate = useNavigate();

  /**
   * React Router hook to access dynamic route parameters.
   *
   * useParams extracts the dynamic parameters from the current route.
   * In this case, it extracts the product ID from the /product/:id route.
   *
   * Route Parameter:
   * - id: Product ID from the URL path
   *
   * Why extract here: The product ID is needed to fetch the specific
   * product data and perform CRUD operations on the correct product.
   */
  const { id } = useParams();

  /**
   * Effect hook to fetch specific product when component mounts.
   *
   * This useEffect runs after the component renders and fetches the
   * specific product based on the ID from the URL parameters. It's
   * essential for populating the product details and form when the
   * user navigates to this page.
   *
   * Dependencies:
   * - fetchProduct: Function reference from the store
   * - id: Product ID from URL parameters
   *
   * Why useEffect: Data fetching is a side effect that should happen
   * after rendering, not during the render phase. useEffect ensures
   * this happens at the right time in the component lifecycle.
   *
   * @see {@link https://react.dev/reference/react/useEffect} React useEffect Documentation
   */
  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  /**
   * Handles product deletion with confirmation and navigation.
   *
   * This async function manages the complete product deletion workflow:
   * 1. Shows confirmation dialog to prevent accidental deletions
   * 2. Calls deleteProduct API function if confirmed
   * 3. Navigates back to homepage after successful deletion
   *
   * User Experience:
   * - Confirmation dialog prevents accidental deletions
   * - Automatic navigation provides immediate feedback
   * - Toast notifications handled by the store
   *
   * Why async: The deleteProduct function is async and we need to
   * wait for it to complete before navigating to ensure the deletion
   * is successful.
   *
   * @returns {Promise<void>} Resolves when deletion and navigation complete
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      navigate('/');
    }
  };

  {
    /*
    Loading State
    =============
    
    This conditional rendering shows a full-screen loading spinner
    when the product is being fetched from the API. It provides
    visual feedback that something is happening and prevents
    user confusion.
    
    Why full-screen loading: Product data is essential for this page
    to function properly. Until the product is loaded, there's no
    meaningful content to display, so a full-screen loading state
    is appropriate.
  */
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  {
    /*
    Error State
    ===========
    
    This conditional rendering shows an error alert when the product
    fetch operation fails. It provides user feedback about what
    went wrong and allows the user to understand the issue.
    
    Why error state: API operations can fail for various reasons
    (network issues, server errors, invalid product ID). Users need
    to know when something goes wrong and why the page isn't working.
  */
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/*
        Back Navigation Button
        ======================
        
        This button provides navigation back to the product catalog.
        It's positioned at the top of the page for easy access and
        uses an arrow icon to clearly indicate its purpose.
        
        Why back navigation: Users need a clear way to return to the
        product catalog after viewing or editing a product. This
        maintains the user's mental model of navigation hierarchy.
      */}
      <button onClick={() => navigate('/')} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      {/*
        Main Content Layout
        ===================
        
        This section provides the main content area with a responsive
        two-column layout. On mobile, it stacks vertically; on larger
        screens, it displays side-by-side for optimal space usage.
        
        Layout Structure:
        - Left Column: Product image display
        - Right Column: Product editing form
        
        Why two-column layout: This layout provides a good balance
        between visual appeal (product image) and functionality
        (editing form). It makes efficient use of screen space
        and provides a clear separation of concerns.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/*
          Product Image Display
          =====================
          
          This section displays the product image in a styled container.
          The image is displayed with proper aspect ratio and styling
          to provide visual context for the product being edited.
          
          Styling Details:
          - Rounded corners for modern appearance
          - Shadow for depth and visual separation
          - Overflow hidden to maintain clean edges
          - Full size with object-cover for proper scaling
          
          Why display image: Visual context helps users understand
          what product they're editing and provides immediate
          feedback when image URLs are changed.
        */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.name}
            className="size-full object-cover"
          />
        </div>

        {/*
          Product Editing Form
          ====================
          
          This section contains the form for editing product details.
          It includes input fields for all product properties and
          action buttons for updating or deleting the product.
          
          Form Structure:
          - Product name input
          - Price input with number validation
          - Image URL input
          - Action buttons (Delete and Save)
          
          Why form-based editing: Forms provide a familiar and
          structured way to edit data. They enable validation,
          controlled inputs, and clear user feedback.
        */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Edit Product</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct(id);
              }}
              className="space-y-6"
            >
              {/*
                Product Name Input
                ===================
                
                This input field allows users to edit the product name.
                It's bound to the formData state and updates the global
                state when changed.
                
                Form Control Features:
                - Controlled input with value binding
                - Placeholder text for guidance
                - Full width for optimal usability
                - Bordered styling for clear definition
                
                Why controlled input: Controlled inputs ensure the
                form state is always in sync with the component state
                and provide predictable behavior for form handling.
              */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Product Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/*
                Product Price Input
                ====================
                
                This input field allows users to edit the product price.
                It uses number input type with validation attributes
                to ensure proper price formatting.
                
                Validation Features:
                - type="number" for numeric input
                - min="0" prevents negative prices
                - step="0.01" allows decimal values
                - Placeholder shows expected format
                
                Why number input: Price data should be numeric, and
                the number input type provides built-in validation
                and mobile keyboard optimization.
              */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Price
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              {/*
                Product Image URL Input
                ========================
                
                This input field allows users to edit the product image URL.
                It's bound to the formData state and updates the image
                display when changed.
                
                Input Features:
                - Text input for URL entry
                - Placeholder with example format
                - Full width for optimal usability
                - Controlled input with state binding
                
                Why URL input: Image URLs are text-based and need
                to be entered manually. The placeholder provides
                guidance on the expected format.
              */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Image URL
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              {/*
                Form Action Buttons
                ====================
                
                This section contains the action buttons for the form.
                It provides both destructive (delete) and constructive
                (save) actions with appropriate styling and validation.
                
                Button Layout:
                - Delete button (left): Destructive action with error styling
                - Save button (right): Primary action with validation
                
                Why this layout: The delete button is positioned on the
                left to make it less prominent, while the save button
                is on the right as the primary action. This follows
                common UI patterns and reduces accidental deletions.
              */}
              <div className="flex justify-between mt-8">
                {/*
                  Delete Product Button
                  ======================
                  
                  This button triggers the product deletion workflow.
                  It's styled with error colors to indicate its
                  destructive nature and includes confirmation.
                  
                  Button Features:
                  - Error styling to indicate destructive action
                  - Trash icon for clear visual indication
                  - Confirmation dialog prevents accidental deletion
                  - Automatic navigation after successful deletion
                  
                  Why confirmation: Product deletion is irreversible
                  and should be protected against accidental clicks.
                  The confirmation dialog provides a safety net.
                */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error"
                >
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Product
                </button>

                {/*
                  Save Changes Button
                  ====================
                  
                  This button submits the form to update the product.
                  It's disabled when the form is invalid or loading
                  to prevent invalid submissions.
                  
                  Button Features:
                  - Primary styling to indicate main action
                  - Disabled state when form is invalid or loading
                  - Loading spinner during async operations
                  - Save icon for clear visual indication
                  
                  Why disabled state: Form validation prevents
                  invalid data from being submitted. The disabled
                  state provides clear feedback about form validity
                  and prevents unnecessary API calls.
                */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.price ||
                    !formData.image
                  }
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
