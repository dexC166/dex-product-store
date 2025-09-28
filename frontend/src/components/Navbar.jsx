/**
 * @fileoverview Navbar Component - Main Application Navigation Header
 *
 * This is the primary navigation component of the DEX Product Store application,
 * serving as the persistent header that appears on all pages. It provides
 * brand identity, navigation controls, theme switching, and contextual
 * information based on the current page.
 *
 * Component Responsibilities:
 * - Display brand logo and application title
 * - Provide navigation back to homepage
 * - Integrate theme selector for global theming
 * - Show product count indicator on homepage
 * - Maintain consistent navigation across all pages
 *
 * Navbar Architecture:
 * - Header: Sticky positioning with backdrop blur effect
 * - Logo: Brand identity with gradient text styling
 * - Right Section: Theme selector and contextual indicators
 * - Responsive Design: Adapts to different screen sizes
 *
 * Styling Features:
 * - Sticky positioning for persistent access
 * - Backdrop blur for modern glass-morphism effect
 * - Gradient text for brand identity
 * - DaisyUI integration for consistent theming
 * - Responsive layout with mobile-first approach
 *
 * State Integration:
 * - Uses useProductStore for product count display
 * - Uses useResolvedPath for route-based conditional rendering
 * - Integrates with ThemeSelector for global theme management
 *
 * Why this structure: The Navbar follows the persistent header pattern
 * where it provides consistent navigation and branding across all
 * pages while adapting its content based on the current route.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * React Router components for navigation and route detection.
 *
 * React Router provides components and hooks for client-side navigation
 * and route management in React applications. These enable SPA behavior
 * without full page reloads.
 *
 * Components Used:
 * - Link: Declarative navigation component
 * - useResolvedPath: Hook to get current route information
 *
 * Why React Router: Enables Single Page Application (SPA) behavior
 * where navigation happens client-side, providing better user
 * experience and performance compared to traditional multi-page
 * applications.
 *
 * @see {@link https://reactrouter.com/en/main} React Router Documentation
 */
import { Link, useResolvedPath } from 'react-router-dom';

/**
 * Lucide React icons for UI elements and visual indicators.
 *
 * Lucide React provides a comprehensive set of beautiful, customizable
 * SVG icons that are optimized for React applications. These icons
 * enhance the user interface with clear visual indicators.
 *
 * Icons Used:
 * - ShoppingCartIcon: Brand logo icon
 * - ShoppingBagIcon: Product count indicator icon
 *
 * Why Lucide React:
 * - Consistent design language across all icons
 * - Lightweight and tree-shakeable
 * - Excellent TypeScript support
 * - Customizable size, color, and styling
 *
 * @see {@link https://lucide.dev/} Lucide Icons Documentation
 */
import { ShoppingBagIcon, ShoppingCartIcon } from 'lucide-react';

/**
 * ThemeSelector component for global theme management.
 *
 * ThemeSelector provides a dropdown interface for switching between
 * different application themes. It integrates with the global theme
 * store to manage theme state and persistence.
 *
 * ThemeSelector Features:
 * - Dropdown interface with theme options
 * - Visual theme previews with color indicators
 * - Integration with useThemeStore for state management
 * - DaisyUI styling for consistent appearance
 *
 * Why separate component: Theme selection is a complex UI pattern
 * that deserves its own component. This separation keeps the Navbar
 * focused on layout while delegating theme management to a specialized
 * component.
 *
 * @see {@link ./ThemeSelector} ThemeSelector component implementation
 */
import ThemeSelector from './ThemeSelector';

/**
 * Product store hook for global state management.
 *
 * useProductStore provides access to the global product state including:
 * - products: Array of all products from the API
 * - loading: Boolean indicating if async operations are in progress
 * - error: String containing error messages from failed operations
 * - CRUD operations: Functions for product management
 *
 * Why global state: Product data needs to be shared across multiple
 * components. The Navbar needs access to the products array to display
 * the product count indicator on the homepage.
 *
 * @see {@link ../store/useProductStore} Product store implementation
 */
import { useProductStore } from '../store/useProductStore';

/**
 * Navbar component - Main application navigation header.
 *
 * This component serves as the persistent navigation header that appears
 * on all pages of the application. It provides brand identity, navigation
 * controls, theme switching, and contextual information based on the
 * current route.
 *
 * Component Structure:
 * - Header: Sticky positioning with backdrop blur effect
 * - Logo: Brand identity with gradient text styling
 * - Right Section: Theme selector and contextual indicators
 * - Responsive Design: Adapts to different screen sizes
 *
 * Styling Features:
 * - Sticky positioning for persistent access
 * - Backdrop blur for modern glass-morphism effect
 * - Gradient text for brand identity
 * - DaisyUI integration for consistent theming
 * - Responsive layout with mobile-first approach
 *
 * State Integration:
 * - Uses useProductStore for product count display
 * - Uses useResolvedPath for route-based conditional rendering
 * - Integrates with ThemeSelector for global theme management
 *
 * User Experience:
 * - Consistent navigation across all pages
 * - Visual feedback with hover effects and transitions
 * - Contextual information (product count on homepage)
 * - Theme switching for personalization
 * - Responsive design for all device sizes
 *
 * @returns {JSX.Element} The main navigation header
 */
function Navbar() {
  /**
   * React Router hook to get current route information.
   *
   * useResolvedPath provides the resolved pathname of the current route,
   * which is used to determine which page the user is currently viewing.
   * This enables conditional rendering based on the current route.
   *
   * Route Detection:
   * - pathname: The current route path (e.g., '/', '/product/1')
   * - Used to determine if user is on homepage
   * - Enables conditional rendering of product count indicator
   *
   * Why useResolvedPath: This hook provides the actual resolved path
   * after all redirects and route resolution, ensuring accurate
   * route detection for conditional rendering.
   */
  const { pathname } = useResolvedPath();

  /**
   * Boolean flag indicating if user is on the homepage.
   *
   * This boolean is derived from the current pathname and is used
   * to conditionally render the product count indicator. The indicator
   * only makes sense on the homepage where products are displayed.
   *
   * Conditional Logic:
   * - true: User is on homepage ('/')
   * - false: User is on any other page (e.g., '/product/1')
   *
   * Why conditional rendering: The product count indicator is only
   * relevant on the homepage where products are displayed. Showing
   * it on other pages would be confusing and cluttered.
   */
  const isHomePage = pathname === '/';

  /**
   * Global product state from Zustand store.
   *
   * This destructuring extracts the products array from the global
   * product store. The Navbar component needs access to the products
   * array to display the product count indicator on the homepage.
   *
   * State Properties:
   * - products: Array of product objects from the API
   *
   * Why destructure here: Only the products array is needed for the
   * count indicator. Other state properties (loading, error, etc.)
   * are not needed in the Navbar component.
   */
  const { products } = useProductStore();

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/*
            Brand Logo Section
            ===================
            
            This section contains the brand logo and application title.
            It's positioned on the left side of the navbar and provides
            navigation back to the homepage when clicked.
            
            Logo Features:
            - Shopping cart icon for visual identity
            - Gradient text for modern appearance
            - Hover effects for interactivity
            - Responsive design with flex layout
            
            Why this design: The logo combines an icon (shopping cart)
            with text (brand name) to create a memorable brand identity.
            The gradient text adds visual interest and modern appeal.
          */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-9 text-primary" />
                <span
                  className="font-semibold font-mono tracking-widest text-2xl 
                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  Dex-Product-Store
                </span>
              </div>
            </Link>
          </div>

          {/*
            Right Section - Controls and Indicators
            =======================================
            
            This section contains the right-side controls and indicators.
            It includes the theme selector and conditional product count
            indicator that only appears on the homepage.
            
            Section Features:
            - Theme selector for global theme switching
            - Product count indicator (homepage only)
            - Responsive layout with gap spacing
            - Consistent alignment and spacing
            
            Why this layout: The right section groups related controls
            together and provides a clean, organized appearance. The
            conditional rendering keeps the interface uncluttered.
          */}
          <div className="flex items-center gap-4">
            {/*
              Theme Selector Component
              =========================
              
              This component provides a dropdown interface for switching
              between different application themes. It integrates with
              the global theme store to manage theme state and persistence.
              
              ThemeSelector Features:
              - Dropdown interface with theme options
              - Visual theme previews with color indicators
              - Integration with useThemeStore for state management
              - DaisyUI styling for consistent appearance
              
              Why render here: Theme selection is a global setting that
              should be accessible from any page. The navbar is the
              perfect place for global controls like theme switching.
            */}
            <ThemeSelector />

            {/*
              Product Count Indicator (Homepage Only)
              ========================================
              
              This section displays the product count indicator only when
              the user is on the homepage. It shows the total number of
              products in the system with a badge indicator.
              
              Indicator Features:
              - Only visible on homepage (conditional rendering)
              - Badge indicator with product count
              - Hover effects for interactivity
              - DaisyUI styling for consistency
              
              Why conditional rendering: The product count indicator
              only makes sense on the homepage where products are
              displayed. Showing it on other pages would be confusing
              and cluttered.
              
              Why this design: The indicator uses a badge pattern
              that's common in e-commerce applications to show counts
              or notifications. It's subtle but informative.
            */}
            {isHomePage && (
              <div className="indicator">
                <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingBagIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    {products.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
