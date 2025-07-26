/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        accent: "#06B6D4",
        dark: "#0F172A",
        light: "#F1F5F9",
        muted: "#94A3B8",
        error: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ['"Space Grotesk"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
