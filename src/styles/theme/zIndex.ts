/**
 * Z-Index System Documentation
 *
 * This file serves as the single source of truth for z-index values throughout the application.
 * The system is designed to provide a consistent and maintainable way to manage stacking contexts.
 *
 * IMPORTANT RULES:
 * 1. NEVER use hardcoded z-index values in components
 * 2. Always import z-index values from this file
 * 3. Use CSS variables in stylesheets
 * 4. Use the TypeScript system in components
 *
 * Z-INDEX HIERARCHY:
 *
 * Base Layers (0-999)
 * - Used for fundamental elements that should always be at the bottom
 * - Includes base content, backgrounds, and static elements
 *
 * UI Components (1000-4999)
 * - Core UI elements that form the application structure
 * - Includes navigation, sidebars, and bottom bars
 * - Floating elements that need to be above base content
 *
 * Interactive Elements (5000-7999)
 * - User interface elements that require interaction
 * - Includes dropdowns, tooltips, and user menus
 * - Project hub components that need to be above regular UI
 *
 * Overlays (8000-9999)
 * - Modal dialogs and toast notifications
 * - System-wide overlays that should be above most content
 *
 * Chat System (10000+)
 * - Dedicated z-index space for chat components
 * - Ensures chat UI stays above all other application elements
 * - Includes all chat-related overlays and modals
 *
 * STACKING CONTEXT MANAGEMENT:
 * - Each major component should create its own stacking context
 * - Use CSS properties that create stacking contexts:
 *   - position: fixed/absolute
 *   - transform: translateZ(0)
 *   - isolation: isolate
 *
 * MOBILE CONSIDERATIONS:
 * - Mobile has its own z-index system (see mobile.css)
 * - Mobile z-indices are lower to ensure proper layering on mobile devices
 * - Mobile components should use mobile-specific z-index variables
 *
 * DEBUGGING:
 * - Use the ZIndexVisualizer component to debug z-index issues
 * - Check browser dev tools for stacking context creation
 * - Verify CSS variable injection in :root
 *
 * BEST PRACTICES:
 * 1. Always use the TypeScript system for type safety
 * 2. Create new stacking contexts when needed
 * 3. Keep z-index values within their designated ranges
 * 4. Document any special cases or exceptions
 * 5. Test on both desktop and mobile
 */

export const ZIndex = {
  // Base layers (0-999)
  base: 0,
  content: 10,
  background: 100,

  // UI Components (1000-4999)
  navbar: 1000,
  sidebar: 1100,
  bottombar: 1200,
  floating: 1500,

  // Interactive elements (5000-7999)
  dropdown: 5000,
  tooltip: 5500,
  projecthub: 6000,
  userMenu: 7000,

  // Overlays (8000-9999)
  modal: 8000,
  toast: 9000,

  // Chat system (10000+)
  chatBase: 10000,
  chatContainer: 10100,
  chatSticky: 10200,
  chatToolbar: 10300,
  chatSidebar: 10400,
  chatOverlay: 10500,
  chatModal: 10600,
  chatTooltip: 10700,
  chatNotification: 10800,
  chatToggleButton: 10900,
  chatGlobalOverlay: 11000,
};

/**
 * Type definitions to ensure type safety when accessing z-index values
 */
export type ZIndexKey = keyof typeof ZIndex;
export type ZIndexValue = (typeof ZIndex)[ZIndexKey];

/**
 * Helper to get z-index CSS variable name from a key
 * Converts camelCase to kebab-case for CSS variable naming
 * Example: chatContainer -> --z-chat-container
 */
export const getZIndexVar = (key: ZIndexKey): string => {
  return `--z-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
};

/**
 * Utility to inject all z-index values as CSS variables
 * This should be called early in the application lifecycle
 * to ensure variables are available before components render
 */
export const injectZIndexVars = (): void => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  Object.entries(ZIndex).forEach(([key, value]) => {
    root.style.setProperty(getZIndexVar(key as ZIndexKey), String(value));
  });
};
