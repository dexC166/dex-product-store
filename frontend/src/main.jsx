/**
 * @fileoverview React Application Entry Point
 *
 * This is the main entry point for the DEX Product Store React application.
 * It initializes the React application, sets up routing, and renders the
 * root component into the DOM. This file serves as the bridge between the
 * HTML document and the React application.
 *
 * Application Architecture:
 * - React 18 with modern concurrent features and hooks
 * - React Router for client-side navigation (SPA behavior)
 * - Zustand for lightweight state management
 * - Tailwind CSS + DaisyUI for styling and theming
 * - Axios for API communication with backend
 *
 * Entry Point Flow:
 * 1. Imports necessary React and routing dependencies
 * 2. Imports global CSS styles (Tailwind CSS)
 * 3. Imports the main App component
 * 4. Creates React root and renders the application
 * 5. Wraps App with StrictMode and BrowserRouter
 *
 * Why this structure: This is the standard pattern for modern React applications
 * that need client-side routing and development-time error checking. The
 * component hierarchy ensures proper routing context and development warnings.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * React StrictMode import for development-time error checking.
 *
 * StrictMode is a development-only tool that helps identify potential
 * problems in your application by intentionally double-invoking functions
 * and enabling additional checks. It does not render any visible UI.
 *
 * What StrictMode does:
 * - Identifies components with unsafe lifecycles
 * - Warns about legacy string ref API usage
 * - Warns about deprecated findDOMNode usage
 * - Detects unexpected side effects
 * - Detects legacy context API
 * - Ensures reusable state
 *
 * Why use StrictMode: In development, it helps catch bugs early by
 * making React more strict about potential issues. It's especially
 * valuable for identifying side effects and ensuring components are
 * resilient to React's future features.
 *
 * @see {@link https://react.dev/reference/react/StrictMode} React StrictMode Documentation
 */
import { StrictMode } from 'react';

/**
 * React 18 createRoot API for rendering React applications.
 *
 * createRoot is the modern way to render React applications in React 18+.
 * It replaces the legacy ReactDOM.render() method and provides better
 * performance and concurrent features.
 *
 * Key benefits of createRoot:
 * - Enables React 18 concurrent features (automatic batching, transitions)
 * - Better performance with concurrent rendering
 * - Improved error boundaries and error recovery
 * - Future-proof API that supports upcoming React features
 *
 * Why createRoot over ReactDOM.render:
 * - React 18+ requires createRoot for concurrent features
 * - Better performance and user experience
 * - Enables automatic batching of state updates
 * - Supports React's new concurrent rendering model
 *
 * @see {@link https://react.dev/reference/react-dom/client/createRoot} createRoot Documentation
 */
import { createRoot } from 'react-dom/client';

/**
 * Global CSS styles import for Tailwind CSS and DaisyUI.
 *
 * This imports the main CSS file that contains Tailwind CSS directives
 * and DaisyUI component styles. The CSS is processed by PostCSS and
 * Vite during the build process.
 *
 * CSS Architecture:
 * - Tailwind CSS: Utility-first CSS framework for rapid UI development
 * - DaisyUI: Component library built on top of Tailwind CSS
 * - Custom styles: Any additional application-specific styles
 *
 * Why import CSS here: Global styles need to be imported at the entry point
 * to ensure they're available throughout the entire application. This
 * approach ensures consistent styling across all components.
 *
 * @see {@link ./index.css} Main CSS file with Tailwind directives
 */
import './index.css';

/**
 * Main App component import.
 *
 * The App component is the root component of the React application.
 * It contains the main layout, routing configuration, and global
 * application state management.
 *
 * App Component Responsibilities:
 * - Sets up React Router with Routes and Route components
 * - Manages global theme state (light/dark mode)
 * - Renders the main layout (Navbar, content area, Toaster)
 * - Handles client-side navigation between pages
 *
 * Component Hierarchy:
 * - App (root component)
 *   - Navbar (navigation and theme selector)
 *   - Routes (page routing)
 *     - HomePage (product listing)
 *     - ProductPage (individual product view)
 *   - Toaster (notification system)
 *
 * @see {@link ./App.jsx} Main App component implementation
 */
import App from './App.jsx';

/**
 * React Router BrowserRouter for client-side navigation.
 *
 * BrowserRouter enables client-side routing in the React application,
 * allowing navigation between different pages without full page reloads.
 * It uses the HTML5 History API to manage the browser's URL.
 *
 * Router Features:
 * - Client-side navigation (no page reloads)
 * - Browser history management (back/forward buttons work)
 * - URL-based routing (/ for homepage, /product/:id for product pages)
 * - Programmatic navigation with Link and useNavigate
 *
 * Why BrowserRouter: This enables Single Page Application (SPA) behavior
 * where the entire application loads once and navigation happens
 * client-side. This provides a smoother user experience and better
 * performance compared to traditional multi-page applications.
 *
 * @see {@link https://reactrouter.com/en/main/router-components/browser-router} BrowserRouter Documentation
 */
import { BrowserRouter } from 'react-router-dom';

/**
 * React Application Initialization and Rendering
 *
 * This is where the React application is actually created and rendered
 * into the DOM. The createRoot API creates a React root, and the render
 * method mounts the application into the specified DOM element.
 *
 * Rendering Process:
 * 1. createRoot() creates a React root for the 'root' DOM element
 * 2. render() mounts the React application into the DOM
 * 3. StrictMode wraps the app for development-time checks
 * 4. BrowserRouter provides routing context for the entire app
 * 5. App component renders the main application layout
 *
 * Component Hierarchy (from outer to inner):
 * - StrictMode: Development-time error checking and warnings
 * - BrowserRouter: Client-side routing context and navigation
 * - App: Main application component with layout and routing
 *
 * Why this nesting order:
 * - StrictMode should wrap the entire app for comprehensive checking
 * - BrowserRouter must wrap all components that use routing features
 * - App contains the actual application logic and layout
 *
 * DOM Integration:
 * - The 'root' element is defined in index.html
 * - React takes control of this element and manages its contents
 * - All subsequent navigation and updates happen within this container
 *
 * @see {@link ../index.html} HTML template with root element
 * @see {@link ./App.jsx} App component that gets rendered
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
