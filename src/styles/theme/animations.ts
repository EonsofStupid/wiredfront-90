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
    float: {
      "0%, 100%": { 
        transform: "translateY(0) rotate(0deg)",
        opacity: 0.8
      },
      "50%": { 
        transform: "translateY(-20px) rotate(5deg)",
        opacity: 1
      },
    },
    glow: {
      "0%, 100%": { 
        opacity: 1,
        boxShadow: "0 0 20px theme('colors.neon.blue'), 0 0 40px theme('colors.neon.pink')"
      },
      "50%": { 
        opacity: 0.6,
        boxShadow: "0 0 40px theme('colors.neon.blue'), 0 0 80px theme('colors.neon.pink')"
      },
    },
    pulse: {
      "0%, 100%": { 
        transform: "scale(1)",
        opacity: 1
      },
      "50%": { 
        transform: "scale(1.1)",
        opacity: 0.8
      },
    },
    "text-shimmer": {
      "0%": {
        backgroundPosition: "200% center"
      },
      "100%": {
        backgroundPosition: "-200% center"
      }
    }
  },
  animation: {
    "gradient-x": "gradient-x 15s ease infinite",
    "gradient-y": "gradient-y 15s ease infinite",
    float: "float 6s ease-in-out infinite",
    glow: "glow 2s ease-in-out infinite",
    pulse: "pulse 2s ease-in-out infinite",
    "text-shimmer": "text-shimmer 8s ease-in-out infinite"
  },
};