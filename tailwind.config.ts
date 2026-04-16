import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif:   ["'Playfair Display'", "Fraunces", "Georgia", "serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        /* Green palette — deepened for luxury feel.
           Tailwind class names (green-600, green-700, etc.) still resolve,
           so existing components continue to compile without churn. */
        green: {
          50:  "#eaf6f2",
          100: "#d6f0e9",
          200: "#aee3d6",
          300: "#7dcfc1",
          400: "#4d9e8a",
          500: "#3a8273",
          600: "#2a6155",
          700: "#1e4c3f",
          800: "#15382e",
          900: "#0f2a23",
        },
        ivory: {
          50:  "#fdfbf5",
          100: "#fbf8f1",
          200: "#f7efe4",
          300: "#efe8d9",
          400: "#e8d4bc",
          500: "#d8cdb4",
        },
        gold: {
          50:  "#f7efe4",
          100: "#f0e0c5",
          200: "#e8d4bc",
          300: "#d9b88a",
          400: "#c7a06f",
          500: "#b8895a",
          600: "#a17548",
          700: "#8f6338",
          800: "#6f4b29",
          900: "#4d331c",
        },
      },
      boxShadow: {
        xs:       "0 1px 2px rgba(15, 28, 26, 0.04)",
        floating: "0 1px 0 rgba(255,255,255,0.60) inset, 0 0 0 1px rgba(184,137,90,0.14), 0 4px 10px -2px rgba(15,28,26,0.06), 0 18px 40px -12px rgba(15,28,26,0.20), 0 40px 80px -28px rgba(15,28,26,0.28)",
        gold:     "0 20px 50px -18px rgba(184, 137, 90, 0.40), 0 8px 22px -10px rgba(184, 137, 90, 0.22)",
        inner2:   "inset 0 1px 0 rgba(255,255,255,0.55)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "slide-up":      "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        "slide-down":    "slideDown 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        "pulse-ring":    "pulseRing 2.2s ease-out infinite",
        "parallax":      "parallaxFloat 7s ease-in-out infinite",
        "disched-orbit": "dishedOrbit 2.6s linear infinite",
        "disched-pulse": "dishedPulse 1.6s ease-in-out infinite",
        "disched-trace": "dishedTrace 3.2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-18px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%":   { transform: "translate(-50%,-50%) scale(1)",    opacity: "0.7" },
          "100%": { transform: "translate(-50%,-50%) scale(1.55)", opacity: "0"   },
        },
        parallaxFloat: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%":     { transform: "translate3d(0,-6px,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
