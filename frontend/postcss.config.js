/**
 * @fileoverview PostCSS Configuration - CSS Processing Pipeline
 *
 * This file configures PostCSS for the DEX Product Store React application,
 * defining the CSS processing pipeline that transforms Tailwind CSS directives
 * and adds vendor prefixes for cross-browser compatibility. PostCSS serves as
 * the bridge between Tailwind CSS and the final CSS output.
 *
 * PostCSS Architecture:
 * - PostCSS: CSS processing tool that transforms CSS using plugins
 * - Tailwind CSS Plugin: Processes @tailwind directives and generates utility classes
 * - Autoprefixer Plugin: Adds vendor prefixes for cross-browser compatibility
 * - Vite Integration: Vite automatically uses this configuration for CSS processing
 *
 * CSS Processing Pipeline:
 * 1. Vite detects CSS files (index.css) and imports
 * 2. PostCSS processes the CSS using configured plugins
 * 3. Tailwind CSS plugin processes @tailwind directives
 * 4. Autoprefixer adds vendor prefixes for browser compatibility
 * 5. Final CSS is optimized and bundled for production
 *
 * Plugin Processing Order:
 * - tailwindcss: Processes @tailwind directives first
 * - autoprefixer: Adds vendor prefixes after Tailwind processing
 * - Order matters: Tailwind must run before autoprefixer
 *
 * Why PostCSS: PostCSS provides a plugin-based architecture for CSS
 * processing that allows us to use modern CSS features while maintaining
 * cross-browser compatibility. It's essential for Tailwind CSS to work
 * properly and for the final CSS to be compatible with all browsers.
 *
 * Build Integration:
 * - Vite automatically detects and uses this configuration
 * - No additional setup required in vite.config.js
 * - Works in both development and production builds
 * - Integrates seamlessly with Tailwind CSS and DaisyUI
 *
 * @author Dayle Cortes
 * @version 1.0.0
 * @see {@link ./src/index.css} CSS entry point with Tailwind directives
 * @see {@link ./tailwind.config.js} Tailwind CSS configuration
 * @see {@link https://postcss.org/} PostCSS Documentation
 * @see {@link https://tailwindcss.com/docs/using-with-postcss} Tailwind CSS with PostCSS
 * @see {@link https://github.com/postcss/autoprefixer} Autoprefixer Documentation
 */

/**
 * PostCSS configuration object for CSS processing pipeline.
 *
 * This configuration defines how PostCSS processes CSS files during the
 * build process. It specifies which plugins to use and in what order
 * they should be applied to transform the CSS.
 *
 * Configuration Structure:
 * - plugins: Object containing PostCSS plugins and their configurations
 * - tailwindcss: Tailwind CSS plugin for processing @tailwind directives
 * - autoprefixer: Autoprefixer plugin for vendor prefix addition
 *
 * Plugin Processing:
 * - Plugins are processed in the order they appear in the object
 * - tailwindcss runs first to process @tailwind directives
 * - autoprefixer runs second to add vendor prefixes
 * - Each plugin can have its own configuration object
 *
 * Why this order: Tailwind CSS must process the @tailwind directives
 * before autoprefixer can add vendor prefixes to the generated CSS.
 * This ensures that vendor prefixes are added to the final utility
 * classes, not the raw @tailwind directives.
 *
 * @type {Object} PostCSS configuration object
 * @property {Object} plugins - PostCSS plugins configuration
 */
export default {
  /**
   * PostCSS plugins configuration for CSS processing.
   *
   * This object defines which PostCSS plugins to use and their
   * configurations. Each plugin processes the CSS in a specific way
   * to transform it from source to final output.
   *
   * Plugin Configuration:
   * - tailwindcss: {} - Empty config uses tailwind.config.js
   * - autoprefixer: {} - Empty config uses default browser support
   *
   * Why empty configs: Both plugins use their default configurations
   * and external config files. Tailwind CSS uses tailwind.config.js,
   * and autoprefixer uses its default browser support settings.
   *
   * @type {Object} PostCSS plugins configuration
   * @property {Object} tailwindcss - Tailwind CSS plugin configuration
   * @property {Object} autoprefixer - Autoprefixer plugin configuration
   */
  plugins: {
    /**
     * Tailwind CSS plugin configuration for processing @tailwind directives.
     *
     * This plugin processes the @tailwind directives in index.css and
     * generates the utility classes based on the tailwind.config.js
     * configuration. It's the core plugin that makes Tailwind CSS work.
     *
     * Tailwind CSS Processing:
     * - Reads @tailwind base, @tailwind components, @tailwind utilities
     * - Generates utility classes based on content paths in tailwind.config.js
     * - Applies DaisyUI component styles and theme variables
     * - Purges unused classes for optimal bundle size
     *
     * Configuration:
     * - {} - Empty object means use tailwind.config.js for configuration
     * - All Tailwind settings are defined in tailwind.config.js
     * - DaisyUI integration is handled through the config file
     *
     * Why empty config: Tailwind CSS plugin automatically looks for
     * tailwind.config.js in the project root. This keeps the configuration
     * centralized and makes it easier to manage Tailwind settings.
     *
     * @type {Object} Tailwind CSS plugin configuration
     */
    tailwindcss: {},

    /**
     * Autoprefixer plugin configuration for vendor prefix addition.
     *
     * This plugin automatically adds vendor prefixes to CSS properties
     * that require them for cross-browser compatibility. It ensures
     * that the generated CSS works consistently across all browsers.
     *
     * Autoprefixer Processing:
     * - Analyzes CSS properties and their browser support requirements
     * - Adds vendor prefixes (-webkit-, -moz-, -ms-, -o-) as needed
     * - Uses browser support data to determine which prefixes are necessary
     * - Removes outdated prefixes that are no longer needed
     *
     * Configuration:
     * - {} - Empty object means use default browser support settings
     * - Default supports all browsers with >0.2% market share
     * - Can be customized with specific browser support requirements
     *
     * Why empty config: The default browser support settings cover
     * all modern browsers and provide good cross-browser compatibility
     * without being overly aggressive with vendor prefixes.
     *
     * @type {Object} Autoprefixer plugin configuration
     */
    autoprefixer: {},
  },
};
