/**
 * @fileoverview Theme Store - Global Theme Management and Persistence
 *
 * This Zustand store manages the global theme state for the DEX Product Store
 * application. It provides a centralized solution for theme switching, persistence,
 * and integration with DaisyUI's theming system across the entire application.
 *
 * Store Architecture:
 * - Theme State: Current theme selection with localStorage persistence
 * - Theme Switching: Function to change themes and update state
 * - DaisyUI Integration: Seamless integration with DaisyUI's theming system
 * - User Experience: Persistent theme preferences across sessions
 *
 * Key Features:
 * - Theme Persistence: Saves theme preference to localStorage
 * - Default Theme: 'forest' as the fallback theme
 * - DaisyUI Integration: Works with DaisyUI's data-theme attribute
 * - Global State: Accessible from any component in the application
 * - Smooth Transitions: Enables CSS transitions for theme changes
 *
 * Why Zustand for Theme Management: Zustand provides a lightweight,
 * performant solution for global theme state that's simpler than Redux
 * but more powerful than React Context. It ensures theme state is
 * accessible throughout the component tree without prop drilling.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * Zustand store creation function for state management.
 *
 * Zustand is a small, fast, and scalable state management solution that
 * provides a simple API for creating stores with actions and state.
 * It's particularly well-suited for managing global application state
 * like theme preferences that need to be accessible from any component.
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
 * Zustand store for theme management and persistence.
 *
 * This store provides a centralized theme management solution that handles
 * theme state, persistence, and integration with DaisyUI's theming system.
 * It ensures theme preferences are maintained across browser sessions and
 * accessible from any component in the application.
 *
 * Store Structure:
 * - theme: Current theme selection with localStorage persistence
 * - setTheme: Function to change themes and update state
 *
 * DaisyUI Integration:
 * - Themes work with DaisyUI's data-theme attribute system
 * - App component applies theme via data-theme={theme}
 * - All child components inherit the selected theme
 * - Smooth transitions enabled with CSS transition classes
 *
 * Available Themes: forest (default), pastel, retro, coffee, cyberpunk,
 * synthwave, luxury, autumn, valentine, aqua, business, night, dracula
 *
 * @param {Function} set - Zustand's state setter function
 * @returns {Object} Store object with theme state and actions
 */
export const useThemeStore = create((set) => ({
  /**
   * Current theme selection with localStorage persistence.
   *
   * This string stores the currently selected theme name. It's initialized
   * from localStorage to maintain theme preference across browser sessions,
   * with 'forest' as the fallback default theme.
   *
   * Theme Initialization:
   * - First checks localStorage for 'preferred-theme' key
   * - Falls back to 'forest' if no stored preference exists
   * - Ensures theme is always defined (never null/undefined)
   *
   * DaisyUI Integration:
   * - Theme name corresponds to DaisyUI theme names
   * - Applied via data-theme attribute on root container
   * - All DaisyUI components automatically inherit the theme
   * - CSS variables are updated based on selected theme
   *
   * Usage: Components access this via useThemeStore().theme
   *
   * @type {string} Current theme name (e.g., 'forest', 'cyberpunk', 'night')
   */
  theme: localStorage.getItem('preferred-theme') || 'forest',

  /**
   * Updates the theme selection and persists it to localStorage.
   *
   * This function handles theme switching by updating both the local state
   * and the persistent storage. It ensures theme changes are immediately
   * reflected in the UI and maintained across browser sessions.
   *
   * Theme Switching Process:
   * 1. Saves new theme to localStorage with 'preferred-theme' key
   * 2. Updates Zustand state to trigger component re-renders
   * 3. App component applies new theme via data-theme attribute
   * 4. All child components inherit the new theme automatically
   *
   * localStorage Integration:
   * - Key: 'preferred-theme'
   * - Value: Theme name string
   * - Persistence: Survives browser restarts and tab closures
   * - Fallback: 'forest' theme if localStorage is empty
   *
   * DaisyUI Integration:
   * - Theme name must match DaisyUI theme names exactly
   * - App component applies theme via data-theme={theme}
   * - CSS transitions provide smooth theme changes
   * - All components automatically inherit new theme
   *
   * Usage: Called by ThemeSelector component when user selects a theme
   *
   * @param {string} theme - Theme name to switch to (must match DaisyUI theme)
   * @returns {void} Updates state and localStorage
   */
  setTheme: (theme) => {
    localStorage.setItem('preferred-theme', theme);
    set({ theme });
  },
}));
