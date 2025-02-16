
export const animations = {
  keyframes: {
    "gradient-y": {
      "0%, 100%": {
        "background-size": "400% 400%",
        "background-position": "center top",
      },
      "50%": {
        "background-size": "200% 200%",
        "background-position": "center center",
      },
    },
    "gradient-x": {
      "0%, 100%": {
        "background-size": "200% 200%",
        "background-position": "left center",
      },
      "50%": {
        "background-size": "200% 200%",
        "background-position": "right center",
      },
    },
    "gradient-xy": {
      "0%, 100%": {
        "background-size": "400% 400%",
        "background-position": "left center",
      },
      "50%": {
        "background-size": "200% 200%",
        "background-position": "right center",
      },
    },
    float: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-20px)" },
    },
    glow: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.6" },
    },
    "text-highlight": {
      "0%": { color: "inherit" },
      "100%": { color: "theme('colors.neon.highlight')" },
    },
    "square-float": {
      "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
      "25%": { transform: "translate(20px, -20px) rotate(90deg)" },
      "50%": { transform: "translate(0, -40px) rotate(180deg)" },
      "75%": { transform: "translate(-20px, -20px) rotate(270deg)" },
    },
  },
  animation: {
    "gradient-x": "gradient-x 15s ease infinite",
    "gradient-y": "gradient-y 15s ease infinite",
    "gradient-xy": "gradient-xy 15s ease infinite",
    float: "float 6s ease-in-out infinite",
    glow: "glow 2s ease-in-out infinite",
    "square-float": "square-float 20s ease-in-out infinite",
  },
};
