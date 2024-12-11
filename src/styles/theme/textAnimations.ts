export const textAnimations = {
  keyframes: {
    "text-highlight-in": {
      "0%": { color: "inherit" },
      "100%": { color: "theme('colors.neon.pink')" }
    },
    "text-highlight-out": {
      "0%": { color: "theme('colors.neon.pink')" },
      "100%": { color: "inherit" }
    }
  },
  animation: {
    "text-highlight-in": "text-highlight-in 0.5s ease-out forwards",
    "text-highlight-out": "text-highlight-out 0.5s ease-out forwards"
  }
};