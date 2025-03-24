/**
 * Debug Utilities
 *
 * This file provides utilities for development debugging features.
 */

/**
 * Enable z-index debugging mode
 * This will add visual indicators for z-index values and stacking contexts
 */
export const enableZIndexDebug = () => {
  if (process.env.NODE_ENV === "development") {
    document.body.classList.add("z-debug");
    console.log("Z-Index debugging enabled");
  }
};

/**
 * Disable z-index debugging mode
 */
export const disableZIndexDebug = () => {
  if (process.env.NODE_ENV === "development") {
    document.body.classList.remove("z-debug");
    console.log("Z-Index debugging disabled");
  }
};

/**
 * Toggle z-index debugging mode
 */
export const toggleZIndexDebug = () => {
  if (process.env.NODE_ENV === "development") {
    document.body.classList.toggle("z-debug");
    console.log(
      "Z-Index debugging toggled:",
      document.body.classList.contains("z-debug")
    );
  }
};
