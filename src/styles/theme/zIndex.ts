
/**
 * Z-Index Hierarchy - Single Source of Truth
 * 
 * This file defines all z-index values used throughout the application.
 * NEVER use hardcoded z-index values in components - always import from this file.
 * 
 * The hierarchy is organized in layers with sufficient spacing between
 * categories to allow for future additions without restructuring.
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
export type ZIndexValue = typeof ZIndex[ZIndexKey];

/**
 * Helper to get z-index CSS variable name from a key
 */
export const getZIndexVar = (key: ZIndexKey): string => {
  return `--z-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
};

/**
 * Utility to inject all z-index values as CSS variables
 */
export const injectZIndexVars = (): void => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  Object.entries(ZIndex).forEach(([key, value]) => {
    root.style.setProperty(getZIndexVar(key as ZIndexKey), String(value));
  });
};
