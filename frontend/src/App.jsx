/**
 * @fileoverview Main App Component - Application Layout and Routing Hub
 *
 * This is the root component of the DEX Product Store React application.
 * It serves as the main layout container, routing hub, and global state
 * coordinator. The App component orchestrates the entire application
 * structure and user experience.
 *
 * Component Responsibilities:
 * - Provides the main application layout structure
 * - Manages global theme state and theming system
 * - Configures client-side routing with React Router
 * - Renders persistent UI elements (Navbar, Toaster)
 * - Handles page-level navigation and routing
 *
 * Application Architecture:
 * - Layout: Fixed Navbar + Dynamic Content Area + Global Toaster
 * - Routing: Client-side navigation with React Router
 * - Theming: Dynamic theme switching with DaisyUI integration
 * - State Management: Global theme state with Zustand
 * - Notifications: Global toast notification system
 *
 * Why this structure: The App component follows the container pattern
 * where it handles layout, routing, and global concerns while delegating
 * specific page logic to dedicated page components. This separation
 * ensures maintainability and clear responsibility boundaries.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * Navigation component import for the main application header.
 *
 * The Navbar component provides the main navigation interface including:
 * - Brand logo and application title
 * - Theme selector dropdown
 * - Product count indicator (on homepage)
 * - Responsive navigation design
 *
 * Why import here: The Navbar is a persistent UI element that appears
 * on all pages, so it's rendered at the App level to ensure consistent
 * navigation across the entire application.
 *
 * @see {@link ./components/Navbar} Navbar component implementation
 */
import Navbar from './components/Navbar';

/**
 * HomePage component import for the main product listing page.
 *
 * The HomePage component displays the product catalog and includes:
 * - Product grid with ProductCard components
 * - Add Product button and modal
 * - Loading states and error handling
 * - Empty state when no products exist
 *
 * Route: "/" - The root path of the application
 *
 * @see {@link ./pages/HomePage} HomePage component implementation
 */
import HomePage from './pages/HomePage';

/**
 * ProductPage component import for individual product management.
 *
 * The ProductPage component handles individual product operations including:
 * - Product detail display and editing
 * - Form-based product updates
 * - Product deletion with confirmation
 * - Navigation back to homepage
 *
 * Route: "/product/:id" - Dynamic route with product ID parameter
 *
 * @see {@link ./pages/ProductPage} ProductPage component implementation
 */
import ProductPage from './pages/ProductPage';

/**
 * React Router components for client-side navigation.
 *
 * Routes and Route enable client-side routing in the React application:
 * - Routes: Container component that defines the routing context
 * - Route: Individual route definitions with path and component mapping
 *
 * Why React Router: Enables Single Page Application (SPA) behavior where
 * navigation happens client-side without full page reloads. This provides
 * better user experience and performance compared to traditional multi-page
 * applications.
 *
 * @see {@link https://reactrouter.com/en/main} React Router Documentation
 */
import { Routes, Route } from 'react-router-dom';

/**
 * Theme store hook for global theme management.
 *
 * useThemeStore provides access to the global theme state including:
 * - Current theme selection (forest, pastel, cyberpunk, etc.)
 * - Theme switching functionality
 * - Persistent theme storage in localStorage
 * - Integration with DaisyUI theming system
 *
 * Why global theme state: Theme preferences should persist across
 * the entire application and be accessible from any component.
 * The App component applies the theme to the root container, ensuring
 * all child components inherit the selected theme.
 *
 * @see {@link ./store/useThemeStore} Theme store implementation
 */
import { useThemeStore } from './store/useThemeStore';

/**
 * Toast notification component for user feedback.
 *
 * Toaster provides global toast notifications for user actions including:
 * - Success messages (product added, updated, deleted)
 * - Error messages (API failures, validation errors)
 * - Loading states and progress indicators
 * - Non-intrusive notification display
 *
 * Why global Toaster: Toast notifications are used throughout the
 * application for user feedback. Placing the Toaster at the App level
 * ensures it can display notifications from any component in the
 * component tree.
 *
 * @see {@link https://react-hot-toast.com/} React Hot Toast Documentation
 */
import { Toaster } from 'react-hot-toast';

/**
 * Main App component - Application layout and routing hub.
 *
 * This is the root component that orchestrates the entire application.
 * It provides the main layout structure, manages global state, and
 * handles client-side routing between different pages.
 *
 * Component Structure:
 * - Root container with theme and styling
 * - Persistent Navbar component
 * - Dynamic Routes for page navigation
 * - Global Toaster for notifications
 *
 * Theme Integration:
 * - Uses useThemeStore to get current theme
 * - Applies theme via data-theme attribute
 * - Enables smooth theme transitions with CSS transitions
 * - Integrates with DaisyUI's theming system
 *
 * Routing Configuration:
 * - "/" → HomePage (product listing and management)
 * - "/product/:id" → ProductPage (individual product editing)
 *
 * Layout Design:
 * - Full-height container (min-h-screen)
 * - Background color with theme support
 * - Smooth color transitions for theme changes
 * - Responsive design with Tailwind CSS
 *
 * @returns {JSX.Element} The main application layout with routing
 */
function App() {
  /**
   * Global theme state from Zustand store.
   *
   * The theme state is managed globally and persisted in localStorage.
   * It controls the visual appearance of the entire application through
   * DaisyUI's theming system.
   *
   * Theme Options: forest (default), pastel, retro, coffee, cyberpunk,
   * synthwave, luxury, autumn, valentine, aqua, business, night, dracula
   *
   * Why destructure here: Only the theme value is needed for the
   * data-theme attribute. The setTheme function is used by the
   * ThemeSelector component in the Navbar.
   */
  const { theme } = useThemeStore();

  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme={theme}
    >
      {/* 
        Main Application Layout Structure:
        
        1. Root Container:
           - min-h-screen: Ensures full viewport height
           - bg-base-200: DaisyUI background color that adapts to theme
           - transition-colors duration-300: Smooth theme transition animation
           - data-theme={theme}: Applies the selected theme to all child components
        
        2. Persistent Navigation:
           - Navbar component rendered at the top
           - Contains logo, theme selector, and product count
           - Sticky positioning for consistent access
        
        3. Dynamic Content Area:
           - Routes component handles client-side navigation
           - Route components define path-to-component mapping
           - Content changes based on current URL without page reload
        
        4. Global Notifications:
           - Toaster component for toast notifications
           - Positioned at the bottom for non-intrusive display
           - Handles success, error, and loading notifications
      */}

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
