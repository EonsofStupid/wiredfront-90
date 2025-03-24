
import type { Config } from "tailwindcss";
import { colors } from "./src/styles/theme/colors";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors,
      scale: {
        '115': '1.15',
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "button-float": "button-float 2s ease-in-out infinite",
        "letter-gradient": "letter-gradient 3s ease infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "rainbow-border": "rainbow-border 6s linear infinite",
      },
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
        "button-float": {
          "0%, 100%": { transform: "translateY(-8px) scale(1.15)" },
          "50%": { transform: "translateY(-12px) scale(1.15)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(123,97,255,0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(123,97,255,0.8)" },
        },
        "rainbow-border": {
          "0%": { borderColor: "#ff0000" },
          "17%": { borderColor: "#ff8000" },
          "33%": { borderColor: "#ffff00" },
          "50%": { borderColor: "#00ff00" },
          "67%": { borderColor: "#0000ff" },
          "83%": { borderColor: "#8000ff" },
          "100%": { borderColor: "#ff0000" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
