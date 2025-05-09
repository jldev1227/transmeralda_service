import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out forwards",
        bounce: "bounce .5s infinite",
        pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spin: "spin 1s linear infinite",
        bottomToTop: "bottomToTop .5s ease-in-out forwards",
        topToBottom: "topToBottom .5s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bottomToTop: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        topToBottom: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px (este será tu base)
        base: ["0.875rem", { lineHeight: "1.25rem" }], // 14px (mismo que sm)
        lg: ["1rem", { lineHeight: "1.5rem" }], // 16px
        xl: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        "2xl": ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        "3xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
        "4xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        "5xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
        "6xl": ["3rem", { lineHeight: "1" }], // 48px
        "7xl": ["3.75rem", { lineHeight: "1" }], // 60px
        "8xl": ["4.5rem", { lineHeight: "1" }], // 72px
        "9xl": ["6rem", { lineHeight: "1" }], // 96px
      },
      transitionDelay: {
        150: "150ms",
        300: "300ms",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require("tailwindcss-animated")],
};

module.exports = config;
