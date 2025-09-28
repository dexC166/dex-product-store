/**
 * @fileoverview Application Constants - Centralized Configuration and Theme Definitions
 *
 * This file contains all application-wide constants and configuration values
 * used throughout the DEX Product Store application. It serves as a single
 * source of truth for shared data that needs to be consistent across
 * multiple components and modules.
 *
 * Constants Architecture:
 * - THEMES: Complete theme definitions with DaisyUI integration
 * - Theme Structure: name, label, and color palette for each theme
 * - DaisyUI Integration: Theme names match DaisyUI's built-in themes
 * - Visual Previews: Color arrays for theme preview indicators
 *
 * Theme System Features:
 * - 13 distinct themes with unique color palettes
 * - DaisyUI-compatible theme names for seamless integration
 * - Human-readable labels for user interface display
 * - Color preview arrays for visual theme selection
 * - Consistent structure for easy maintenance and extension
 *
 * Why Centralized Constants:
 * - Single source of truth for shared configuration
 * - Easy maintenance and updates across the application
 * - Prevents inconsistencies between components
 * - Simplifies adding new themes or modifying existing ones
 * - Enables type safety and better IDE support
 *
 * Usage Patterns:
 * - Imported by ThemeSelector for dropdown options
 * - Used by useThemeStore for theme validation
 * - Referenced in documentation and comments
 * - Extended by new components that need theme access
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * Complete theme definitions for the DEX Product Store application.
 *
 * This array contains all available themes that users can select from
 * the ThemeSelector component. Each theme is defined with a name that
 * matches DaisyUI's built-in theme system, a human-readable label,
 * and a color palette for visual previews.
 *
 * Theme Structure:
 * - name: Theme identifier that matches DaisyUI theme names exactly
 * - label: Human-readable theme name displayed in the UI
 * - colors: Array of hex color codes for theme preview indicators
 *
 * DaisyUI Integration:
 * - Theme names must match DaisyUI's built-in theme names exactly
 * - Applied via data-theme attribute on the root container
 * - All DaisyUI components automatically inherit the selected theme
 * - CSS variables are updated based on the selected theme
 *
 * Color Palette Design:
 * - Each theme includes 3 representative colors
 * - Colors are chosen to represent the theme's aesthetic
 * - Used for visual previews in the ThemeSelector dropdown
 * - Provides immediate visual feedback about theme appearance
 *
 * Available Themes:
 * - pastel: Soft, muted colors with gentle tones
 * - retro: Vintage-inspired earth tones and warm colors
 * - coffee: Dark, rich browns and warm neutrals
 * - forest: Natural greens and earth tones
 * - cyberpunk: Bright neon colors with high contrast
 * - synthwave: Purple and pink neon with retro vibes
 * - luxury: Dark backgrounds with gold accents
 * - autumn: Warm oranges, reds, and browns
 * - valentine: Pink and red romantic colors
 * - aqua: Blue and teal water-inspired tones
 * - business: Professional blues and grays
 * - night: Dark grays and cool tones
 * - dracula: Dark purple with bright accent colors
 *
 * Why This Structure:
 * - Centralized theme definitions prevent inconsistencies
 * - Easy to add new themes without touching multiple files
 * - DaisyUI integration ensures seamless theming
 * - Color previews enhance user experience
 * - Consistent structure enables programmatic theme handling
 *
 * @type {Array<Object>} Array of theme definition objects
 * @property {string} name - Theme identifier (matches DaisyUI theme names)
 * @property {string} label - Human-readable theme name
 * @property {Array<string>} colors - Hex color codes for theme preview
 *
 * @example
 * // Accessing theme data
 * import { THEMES } from '../constants';
 *
 * // Get all theme names
 * const themeNames = THEMES.map(theme => theme.name);
 *
 * // Find a specific theme
 * const forestTheme = THEMES.find(theme => theme.name === 'forest');
 *
 * // Get theme colors for preview
 * const cyberpunkColors = THEMES.find(theme => theme.name === 'cyberpunk').colors;
 *
 * @see {@link ../components/ThemeSelector} ThemeSelector component usage
 * @see {@link ../store/useThemeStore} Theme store integration
 * @see {@link https://daisyui.com/docs/themes/} DaisyUI Theme Documentation
 */
export const THEMES = [
  {
    name: 'pastel',
    label: 'Pastel',
    colors: ['#ffd8d8', '#b7e4c7', '#d8b4fe'],
  },
  {
    name: 'retro',
    label: 'Retro',
    colors: ['#e2d5bc', '#ef9995', '#a4cbb4'],
  },
  {
    name: 'coffee',
    label: 'Coffee',
    colors: ['#20161F', '#A67C58', '#807666'],
  },
  {
    name: 'forest',
    label: 'Forest',
    colors: ['#171212', '#2B4C3F', '#6BAA75'],
  },
  {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    colors: ['#FF00FF', '#00FFFF', '#FF7598'],
  },
  {
    name: 'synthwave',
    label: 'Synthwave',
    colors: ['#2D1B69', '#FF1E9E', '#1EDBFF'],
  },
  {
    name: 'luxury',
    label: 'Luxury',
    colors: ['#171618', '#B6862D', '#E2C697'],
  },
  {
    name: 'autumn',
    label: 'Autumn',
    colors: ['#D8B4A0', '#D27548', '#BA4A00'],
  },
  {
    name: 'valentine',
    label: 'Valentine',
    colors: ['#E96D7B', '#FF8FAB', '#FFB3C6'],
  },
  {
    name: 'aqua',
    label: 'Aqua',
    colors: ['#2DD4BF', '#06B6D4', '#0EA5E9'],
  },
  {
    name: 'business',
    label: 'Business',
    colors: ['#1C4E80', '#0091D5', '#7DB9DE'],
  },
  {
    name: 'night',
    label: 'Night',
    colors: ['#0F172A', '#334155', '#64748B'],
  },
  {
    name: 'dracula',
    label: 'Dracula',
    colors: ['#282A36', '#BD93F9', '#FF79C6'],
  },
];
