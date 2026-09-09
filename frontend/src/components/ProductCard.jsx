/**
 * @fileoverview ProductCard Component - Individual Product Display and Management
 *
 * This is a reusable component of the DEX Product Store application,
 * serving as the individual product display card. It provides a
 * comprehensive view of a single product with image, information,
 * and management actions in a card-based layout.
 *
 * Component Responsibilities:
 * - Display product information (image, name, price)
 * - Provide navigation to product detail page
 * - Handle product deletion with confirmation
 * - Maintain consistent card styling and interactions
 * - Integrate with global state management
 *
 * Card Architecture:
 * - Image: Product image with aspect ratio preservation
 * - Content: Product name and formatted price
 * - Actions: Edit and delete buttons with icons
 * - Styling: DaisyUI card with hover effects and transitions
 *
 * Display Features:
 * - Responsive image with 16:9 aspect ratio
 * - Formatted currency display with proper localization
 * - Hover effects for better user interaction
 * - Icon-enhanced action buttons for clear functionality
 * - Consistent styling with DaisyUI theme system
 *
 * State Management Integration:
 * - Uses useProductStore for deleteProduct function
 * - Integrates with global product state updates
 * - Handles optimistic updates for better UX
 * - Provides immediate visual feedback
 *
 * Why card approach: Cards provide a clean, organized way to
 * display product information in a grid layout. They maintain
 * visual consistency and provide clear action boundaries.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * Lucide React icons for UI elements and visual indicators.
 *
 * Lucide React provides a comprehensive set of beautiful, customizable
 * SVG icons that are optimized for React applications. These icons
 * enhance the user interface with clear visual indicators.
 *
 * Icons Used:
 * - EditIcon: Edit button icon for navigation to product detail page
 * - Trash2Icon: Delete button icon for product deletion
 *
 * Why Lucide React:
 * - Consistent design language across all icons
 * - Lightweight and tree-shakeable
 * - Excellent TypeScript support
 * - Customizable size, color, and styling
 *
 * @see {@link https://lucide.dev/} Lucide Icons Documentation
 */
import { EditIcon, Trash2Icon } from 'lucide-react';

/**
 * React Router Link component for client-side navigation.
 *
 * Link provides declarative navigation in React Router applications,
 * enabling client-side routing without full page reloads. It's
 * essential for Single Page Application (SPA) behavior.
 *
 * Navigation Features:
 * - Client-side routing without page reloads
 * - Programmatic navigation with to prop
 * - Active link styling and state management
 * - Accessibility support for keyboard navigation
 *
 * Why React Router: Enables SPA behavior where navigation
 * happens client-side, providing better user experience
 * and performance compared to traditional multi-page
 * applications.
 *
 * @see {@link https://reactrouter.com/en/main} React Router Documentation
 */
import { Link } from 'react-router-dom';

/**
 * Product store hook for global state management.
 *
 * useProductStore provides access to the global product state including:
 * - deleteProduct: Function to delete products via API
 * - products: Array of all products from the API
 * - loading: Boolean indicating if async operations are in progress
 * - error: String containing error messages from failed operations
 *
 * Why global state: Product deletion needs to update the global
 * product list immediately. Global state ensures consistent
 * data across all components and eliminates prop drilling.
 *
 * @see {@link ../store/useProductStore} Product store implementation
 */
import { useProductStore } from '../store/useProductStore';

/**
 * ProductCard component - Individual product display and management.
 *
 * This component renders a single product in a card format with
 * comprehensive product information, navigation capabilities, and
 * management actions. It's designed to be reusable across different
 * contexts while maintaining consistent styling and behavior.
 *
 * Component Structure:
 * - Card Container: DaisyUI card with hover effects and transitions
 * - Product Image: Responsive image with aspect ratio preservation
 * - Product Info: Name and formatted price display
 * - Card Actions: Edit and delete buttons with icons
 *
 * Display Features:
 * - Responsive image with 16:9 aspect ratio
 * - Formatted currency display with proper localization
 * - Hover effects for better user interaction
 * - Icon-enhanced action buttons for clear functionality
 * - Consistent styling with DaisyUI theme system
 *
 * State Management:
 * - Uses useProductStore for deleteProduct function
 * - Integrates with global product state updates
 * - Handles optimistic updates for better UX
 * - Provides immediate visual feedback
 *
 * User Experience:
 * - Clear visual hierarchy with image, name, and price
 * - Intuitive action buttons with icons
 * - Hover effects for interactive feedback
 * - Consistent styling across all product cards
 * - Responsive design for different screen sizes
 *
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data object
 * @param {number} props.product.id - Unique product identifier
 * @param {string} props.product.name - Product name
 * @param {string} props.product.price - Product price as string
 * @param {string} props.product.image - Product image URL
 * @param {string} props.product.created_at - Product creation timestamp
 * @returns {JSX.Element} The product card display
 */
function ProductCard({ product }) {
  /**
   * Global product state from Zustand store.
   *
   * This destructuring extracts the deleteProduct function from
   * the global product store. The ProductCard component needs
   * access to this function to handle product deletion when
   * the delete button is clicked.
   *
   * State Properties:
   * - deleteProduct: Function to delete products via API
   *
   * Why destructure here: Only the deleteProduct function is needed
   * for the delete action. Other state properties (products, loading,
   * etc.) are not needed in this component.
   */
  const { deleteProduct } = useProductStore();

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative z-0">
      {/*
        Product Image Display
        =====================
        
        This section displays the product image with proper aspect
        ratio preservation and responsive design. The image is
        positioned absolutely within a figure element to maintain
        consistent card dimensions.
        
        Image Features:
        - 16:9 aspect ratio (pt-[56.25%] = 56.25% padding-top)
        - Responsive design with object-cover
        - Proper alt text for accessibility
        - Absolute positioning for consistent layout
        
        Why 16:9 aspect ratio: This is the standard widescreen
        aspect ratio that works well for product images and
        provides consistent card heights in grid layouts.
        
        Why object-cover: This CSS property ensures the image
        covers the entire container while maintaining its aspect
        ratio, preventing distortion and ensuring consistent
        visual appearance.
      */}
      <figure className="relative pt-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>

      <div className="card-body">
        {/*
          Product Information Display
          ============================
          
          This section displays the product name and price with
          proper formatting and styling. The information is
          organized in a clear hierarchy for easy reading.
          
          Information Features:
          - Product name with card-title styling
          - Formatted price with currency symbol
          - Proper typography hierarchy
          - DaisyUI theme integration
          
          Why this layout: The name and price are the most
          important information for users, so they're displayed
          prominently in the card body with clear typography.
        */}
        <h2 className="card-title text-lg font-semibold">{product.name}</h2>
        <p className="text-2xl font-bold text-primary">
          $
          {Number(product.price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        {/*
          Card Action Buttons
          ====================
          
          This section contains the action buttons for the product
          card. It provides both edit and delete actions with
          appropriate styling and functionality.
          
          Button Layout:
          - Edit button (left): Navigates to product detail page
          - Delete button (right): Deletes product with confirmation
          
          Why this layout: The edit button is positioned on the
          left as the primary action, while the delete button is
          on the right as a secondary, destructive action. This
          follows common UI patterns and reduces accidental deletions.
        */}
        <div className="card-actions justify-end mt-4">
          {/*
            Edit Product Button
            ====================
            
            This button navigates to the product detail page for
            editing. It uses React Router Link for client-side
            navigation and includes an edit icon for clear
            visual indication.
            
            Button Features:
            - Info styling to indicate informational action
            - Outline style for subtle appearance
            - Edit icon for clear visual indication
            - Small size for compact card layout
            - Client-side navigation with React Router
            
            Why Link component: Client-side navigation provides
            better user experience with faster page transitions
            and maintains application state.
          */}
          <Link
            to={`/product/${product.id}`}
            className="btn btn-sm btn-info btn-outline"
          >
            <EditIcon className="size-4" />
          </Link>

          {/*
            Delete Product Button
            ======================
            
            This button triggers product deletion with immediate
            API call and state update. It's styled with error
            colors to indicate its destructive nature.
            
            Button Features:
            - Error styling to indicate destructive action
            - Outline style for subtle appearance
            - Trash icon for clear visual indication
            - Small size for compact card layout
            - Immediate deletion without confirmation
            
            Why immediate deletion: Unlike the ProductPage delete
            button, this one provides immediate deletion for
            quick product management. The user can see the
            product disappear immediately, providing clear feedback.
            
            Why error styling: Red/error colors clearly indicate
            that this is a destructive action that cannot be undone.
          */}
          <button
            className="btn btn-sm btn-error  btn-outline"
            onClick={() => deleteProduct(product.id)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
