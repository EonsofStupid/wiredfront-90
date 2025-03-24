
/**
 * Core theme variables
 * IMPORTANT: Do not modify these values without careful consideration
 * These values are used throughout the application for consistent styling
 */

import { ZIndex } from './zIndex';

export const coreColors = {
  // Primary colors
  neonBlue: "#00FFFF",
  neonPink: "#FF007F",
  neonViolet: "#9D00FF",
  
  // Background colors
  dark: "#1A1A1A",
  darkLighter: "#2B2B2B",
  
  // Border colors
  borderLight: "rgba(255, 255, 255, 0.1)",
  borderNeonBlue: "rgba(0, 255, 255, 0.2)",
  borderNeonPink: "rgba(255, 0, 127, 0.2)",
  
  // Text colors
  textPrimary: "hsl(0, 0%, 98%)",
  textSecondary: "hsl(210, 20%, 80%)",
  textMuted: "hsl(215, 16%, 47%)",
};

export const coreShadows = {
  card: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  glow: `0 0 20px ${coreColors.neonBlue}, 0 0 40px ${coreColors.neonPink}`,
  subtle: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
};

/**
 * Core layout dimensions
 * These should match the values in src/core/layout/types.ts
 */
export const coreDimensions = {
  topBarHeight: "4rem", // 64px
  bottomBarHeight: "3rem", // 48px
  leftSidebarExpandedWidth: "8rem", // 128px
  leftSidebarCompactWidth: "5rem", // 80px
  rightSidebarWidth: "16rem", // 256px
};

/**
 * Core z-index values imported directly from the centralized zIndex.ts file
 * No duplication of z-index values allowed!
 */
export const coreZIndex = ZIndex;

