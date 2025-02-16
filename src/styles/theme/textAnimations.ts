
export const textAnimations = {
  keyframes: {
    "text-highlight-in": {
      "0%": {
        color: "inherit",
      },
      "100%": {
        color: "rgb(255, 0, 127)", // Using direct RGB value for pink
      },
    },
    "text-highlight-out": {
      "0%": {
        color: "rgb(255, 0, 127)",
      },
      "100%": {
        color: "inherit",
      },
    },
  },
  animation: {
    "text-highlight-in": "text-highlight-in 1.5s ease-out forwards",
    "text-highlight-out": "text-highlight-out 1.5s ease-out forwards",
  },
};
