/**
 * @fileoverview Tailwind CSS Configuration - Styling Framework Setup
 *
 * This file configures Tailwind CSS and DaisyUI for the DEX Product Store
 * React application. It defines the styling framework, theme system, and
 * build optimization settings that power the entire application's visual
 * design and user interface.
 *
 * Configuration Architecture:
 * - Tailwind CSS: Utility-first CSS framework for rapid UI development
 * - DaisyUI Plugin: Component library with built-in theming system
 * - Content Paths: File scanning configuration for class purging
 * - Theme System: 13 available themes with consistent naming
 * - Build Integration: Vite and PostCSS processing configuration
 *
 * Theme System Features:
 * - 13 distinct themes with unique color palettes and aesthetics
 * - DaisyUI-compatible theme names for seamless integration
 * - Dynamic theme switching via data-theme attribute
 * - Consistent theme naming across constants and configuration
 * - Automatic component adaptation to selected themes
 *
 * Build Process Integration:
 * - Vite processes this configuration during development and build
 * - PostCSS uses this config to generate utility classes
 * - Content paths enable intelligent class purging for optimization
 * - DaisyUI plugin adds component styles and theme variables
 * - Final CSS is optimized and bundled for production
 *
 * Why This Configuration:
 * - Centralized styling configuration prevents inconsistencies
 * - DaisyUI integration provides rich component library
 * - Theme system enables dynamic visual customization
 * - Content paths ensure optimal build performance
 * - Plugin architecture allows for easy extensibility
 *
 * @author Dayle Cortes
 * @version 1.0.0
 * @see {@link ./src/index.css} CSS entry point with Tailwind directives
 * @see {@link ./src/constants/index.js} Theme constants matching this configuration
 * @see {@link https://tailwindcss.com/docs/configuration} Tailwind CSS Configuration
 * @see {@link https://daisyui.com/docs/config/} DaisyUI Configuration
 */

/**
 * DaisyUI plugin import for component library and theming.
 *
 * DaisyUI is a component library built on top of Tailwind CSS that provides
 * pre-built components with built-in theming support. It extends Tailwind's
 * utility classes with semantic component classes and theme-aware styling.
 *
 * DaisyUI Features:
 * - Pre-built components (buttons, cards, modals, forms, etc.)
 * - Built-in theming system with 30+ themes
 * - Semantic class names for better maintainability
 * - Automatic theme adaptation for all components
 * - Consistent design language across components
 *
 * Why DaisyUI: DaisyUI provides a rich set of components that work
 * seamlessly with Tailwind's utility classes while maintaining
 * consistency and theming capabilities. It accelerates development
 * without sacrificing customization flexibility.
 *
 * @see {@link https://daisyui.com/} DaisyUI Documentation
 */
import daisyui from 'daisyui';

/**
 * Tailwind CSS configuration object for the DEX Product Store application.
 *
 * This configuration defines how Tailwind CSS processes styles, which
 * files to scan for classes, and how DaisyUI integrates with the
 * styling system. It serves as the central configuration for all
 * styling-related build processes.
 *
 * Configuration Structure:
 * - content: File paths for Tailwind to scan for class usage
 * - theme: Custom theme extensions and design tokens
 * - plugins: Array of Tailwind plugins (DaisyUI)
 * - daisyui: DaisyUI-specific configuration and theme selection
 *
 * Build Integration:
 * - Vite processes this configuration during development and build
 * - PostCSS uses this config to generate utility classes
 * - Content paths enable intelligent class purging for optimization
 * - DaisyUI plugin adds component styles and theme variables
 *
 * @type {import('tailwindcss').Config} Tailwind CSS configuration type
 */
export default {
  // Content paths for Tailwind CSS class scanning and purging
  // This array tells Tailwind which files to scan for class usage.
  // During the build process, Tailwind will only include CSS for
  // classes that are actually used in these files, significantly
  // reducing the final bundle size.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // Theme configuration for custom design tokens and extensions
  // This object allows you to extend Tailwind's default theme with
  // custom colors, fonts, spacing, and other design tokens. For this
  // application, we're using DaisyUI's built-in themes, so we don't
  // need to extend the default theme.
  theme: {
    extend: {},
  },

  // Tailwind CSS plugins array for extending functionality
  // This array contains all the Tailwind plugins that extend the
  // framework's functionality. For this application, we're using
  // the DaisyUI plugin to add component classes and theming.
  plugins: [daisyui],

  // DaisyUI-specific configuration for component library and theming
  // This object configures DaisyUI's behavior, including which themes
  // are available and how components should be styled. It's essential
  // for the theming system to work properly throughout the application.
  daisyui: {
    themes: [
      'pastel', // Soft, muted colors with gentle tones
      'retro', // Vintage-inspired earth tones and warm colors
      'coffee', // Dark, rich browns and warm neutrals
      'forest', // Natural greens and earth tones
      'cyberpunk', // Bright neon colors with high contrast
      'synthwave', // Purple and pink neon with retro vibes
      'luxury', // Dark backgrounds with gold accents
      'autumn', // Warm oranges, reds, and browns
      'valentine', // Pink and red romantic colors
      'aqua', // Blue and teal water-inspired tones
      'business', // Professional blues and grays
      'night', // Dark grays and cool tones
      'dracula', // Dark purple with bright accent colors
    ],
  },
};
