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
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        green: {
          50:  "#f0faf8",
          100: "#d6f0e9",
          200: "#aee3d6",
          300: "#7dcfc1",
          400: "#4cb9a5",
          500: "#3aa08c",
          600: "#4d9e8a",
          700: "#3a8273",
          800: "#2a6155",
          900: "#1d4840",
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        "slide-down": "slideDown 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        "pulse-ring": "pulseRing 2.2s ease-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "translate(-50%,-50%) scale(1)", opacity: "0.7" },
          "100%": { transform: "translate(-50%,-50%) scale(1.55)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
