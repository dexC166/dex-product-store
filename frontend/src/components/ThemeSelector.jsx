/**
 * @fileoverview ThemeSelector Component - Global Theme Management Interface
 *
 * This is a specialized component of the DEX Product Store application,
 * serving as the global theme management interface. It provides a
 * dropdown-based theme selection system with visual previews and
 * seamless integration with DaisyUI's theming system.
 *
 * Component Responsibilities:
 * - Display dropdown interface for theme selection
 * - Provide visual theme previews with color indicators
 * - Integrate with global theme state management
 * - Handle theme switching and persistence
 * - Maintain consistent styling with DaisyUI
 *
 * Dropdown Architecture:
 * - Trigger: Ghost button with palette icon
 * - Content: Scrollable list of theme options
 * - Preview: Color indicators for each theme
 * - Styling: DaisyUI dropdown with backdrop blur
 *
 * Theme Features:
 * - 13 available themes with distinct color palettes
 * - Visual color previews for each theme option
 * - Active theme highlighting with primary colors
 * - Smooth transitions and hover effects
 * - Persistent theme selection across sessions
 *
 * State Management Integration:
 * - Uses useThemeStore for theme state and switching
 * - Integrates with localStorage for persistence
 * - Applies themes via data-theme attribute
 * - Provides immediate visual feedback
 *
 * Why dropdown approach: Dropdowns provide a compact,
 * accessible way to present multiple theme options
 * without cluttering the interface. They maintain
 * visual hierarchy while offering rich functionality.
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
 * - PaletteIcon: Theme selector trigger and option indicator
 *
 * Why Lucide React:
 * - Consistent design language across all icons
 * - Lightweight and tree-shakeable
 * - Excellent TypeScript support
 * - Customizable size, color, and styling
 *
 * @see {@link https://lucide.dev/} Lucide Icons Documentation
 */
import { PaletteIcon } from 'lucide-react';

/**
 * Theme constants for available theme options.
 *
 * THEMES is an array of theme objects that define all available
 * themes in the application. Each theme includes a name, label,
 * and color palette for visual previews.
 *
 * Theme Structure:
 * - name: Theme identifier (matches DaisyUI theme names)
 * - label: Human-readable theme name
 * - colors: Array of hex color codes for preview
 *
 * Available Themes: pastel, retro, coffee, forest, cyberpunk,
 * synthwave, luxury, autumn, valentine, aqua, business, night, dracula
 *
 * Why separate constants: Theme definitions are shared across
 * multiple components and should be centralized for consistency.
 * This approach makes it easy to add new themes or modify
 * existing ones without touching multiple files.
 *
 * @see {@link ../constants/index.js} Theme constants definition
 */
import { THEMES } from '../constants';

/**
 * Theme store hook for global theme management.
 *
 * useThemeStore provides access to the global theme state including:
 * - theme: Current theme selection with localStorage persistence
 * - setTheme: Function to change themes and update state
 *
 * Why global state: Theme selection affects the entire application
 * and needs to be accessible from any component. Global state
 * ensures consistent theming and eliminates prop drilling.
 *
 * @see {@link ../store/useThemeStore} Theme store implementation
 */
import { useThemeStore } from '../store/useThemeStore';

/**
 * ThemeSelector component - Global theme management interface.
 *
 * This component provides a dropdown interface for switching between
 * different application themes. It integrates with the global theme
 * store to manage theme state and persistence, providing a seamless
 * theming experience across the entire application.
 *
 * Component Structure:
 * - Dropdown Container: DaisyUI dropdown with backdrop blur
 * - Trigger Button: Ghost button with palette icon
 * - Theme Options: Scrollable list of theme choices
 * - Color Previews: Visual indicators for each theme
 *
 * Theme Features:
 * - 13 available themes with distinct color palettes
 * - Visual color previews for each theme option
 * - Active theme highlighting with primary colors
 * - Smooth transitions and hover effects
 * - Persistent theme selection across sessions
 *
 * State Management:
 * - Uses useThemeStore for theme state and switching
 * - Integrates with localStorage for persistence
 * - Applies themes via data-theme attribute
 * - Provides immediate visual feedback
 *
 * User Experience:
 * - Compact dropdown interface
 * - Visual theme previews with color indicators
 * - Active theme highlighting for clear selection
 * - Smooth transitions and hover effects
 * - Accessible keyboard navigation
 *
 * @returns {JSX.Element} The theme selection dropdown interface
 */
function ThemeSelector() {
  /**
   * Global theme state from Zustand store.
   *
   * This destructuring extracts the necessary state and actions from
   * the global theme store. The ThemeSelector component needs access
   * to the current theme and the setTheme function to manage theme
   * switching and display the active theme.
   *
   * State Properties:
   * - theme: Current theme selection with localStorage persistence
   * - setTheme: Function to change themes and update state
   *
   * Why destructure here: Only the needed properties are extracted
   * to keep the component focused and avoid unnecessary re-renders
   * when unrelated state changes.
   */
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end z-[100]">
      {/*
        Dropdown Trigger Button
        ========================
        
        This button serves as the trigger for the theme selection
        dropdown. It's styled as a ghost button with a palette icon
        to clearly indicate its purpose as a theme selector.
        
        Button Features:
        - Ghost styling for subtle appearance
        - Circular shape for compact design
        - Palette icon for clear visual indication
        - Proper tabIndex for keyboard navigation
        - Hover effects for interactive feedback
        
        Why ghost button: Ghost buttons provide a subtle,
        non-intrusive way to access secondary functionality
        like theme selection. They don't compete with primary
        actions for attention.
        
        Why circular shape: Circular buttons are compact and
        work well in navigation bars. They provide a clean,
        modern appearance while maintaining accessibility.
      */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>

      {/*
        Dropdown Content
        =================
        
        This section contains the theme selection options in a
        scrollable dropdown. It's positioned at the end of the
        trigger button and styled with backdrop blur for a
        modern, glass-morphism effect.
        
        Content Features:
        - Scrollable list of theme options
        - Backdrop blur for modern appearance
        - Rounded corners and subtle borders
        - Fixed width for consistent layout
        - Proper z-index for layering
        
        Why backdrop blur: Backdrop blur creates a modern,
        glass-morphism effect that makes the dropdown feel
        integrated with the background while maintaining
        readability and visual hierarchy.
        
        Why fixed width: A consistent width ensures all
        theme options are displayed uniformly and prevents
        layout shifts when switching between themes.
      */}
      <div
        tabIndex={0}
        className="dropdown-content z-[100] mt-2 p-1 shadow-2xl bg-base-100 text-base-content rounded-2xl
        w-56 border border-base-content/20 max-h-[70vh] overflow-y-auto
        "
      >
        {/*
          Theme Options List
          ===================
          
          This section maps through all available themes and
          renders them as clickable buttons. Each theme option
          includes a label, color preview, and active state
          highlighting.
          
          Option Features:
          - Full-width buttons for easy clicking
          - Active theme highlighting with primary colors
          - Hover effects for interactive feedback
          - Color previews for visual theme indication
          - Smooth transitions for state changes
          
          Why map through themes: This approach makes it easy
          to add new themes or modify existing ones without
          changing the component code. It ensures consistency
          and maintainability.
          
          Why active highlighting: Users need to know which
          theme is currently selected. Highlighting the active
          theme provides clear visual feedback and prevents
          confusion.
        */}
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`
                w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
                ${
                  theme === themeOption.name
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-base-content/5'
                }
              `}
            onClick={() => setTheme(themeOption.name)}
          >
            {/*
              Theme Option Icon
              ===================
              
              This icon provides visual consistency across all
              theme options. It uses the same palette icon as
              the trigger button to maintain visual coherence.
              
              Icon Features:
              - Consistent palette icon for all options
              - Smaller size for compact layout
              - Inherits color from parent button
              - Provides visual hierarchy
              
              Why palette icon: The palette icon clearly
              indicates that this is a theme-related option.
              Using the same icon across all options maintains
              visual consistency and reduces cognitive load.
            */}
            <PaletteIcon className="size-4" />

            {/*
              Theme Option Label
              ====================
              
              This span displays the human-readable theme name.
              It's styled with medium font weight for clear
              readability and proper hierarchy.
              
              Label Features:
              - Human-readable theme names
              - Medium font weight for emphasis
              - Small text size for compact layout
              - Inherits color from parent button
              
              Why human-readable labels: Theme names like
              'cyberpunk' and 'forest' are more user-friendly
              than technical identifiers. They provide clear
              context about what each theme represents.
            */}
            <span className="text-sm font-medium">{themeOption.label}</span>

            {/*
              Theme Color Preview
              =====================
              
              This section displays color previews for each theme
              using small circular indicators. It provides visual
              context about what each theme looks like without
              requiring users to select it first.
              
              Preview Features:
              - Small circular color indicators
              - Multiple colors per theme for variety
              - Right-aligned for visual balance
              - Gap spacing for clear separation
              - Dynamic colors from theme definition
              
              Why color previews: Visual previews help users
              understand what each theme looks like before
              selecting it. This reduces the need to try
              multiple themes and provides immediate feedback.
              
              Why multiple colors: Each theme has a distinct
              color palette. Showing multiple colors gives
              users a better sense of the theme's overall
              aesthetic and color harmony.
            */}
            <div className="ml-auto flex gap-1">
              {themeOption.colors.map((color, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
