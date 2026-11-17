import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F9FA",
        surface: "#FFFFFF",
        borderSubtle: "#EBEBEB",
        brandDark: "#121212",
        brandMuted: "#767676",
        brandOrange: {
          DEFAULT: "#F97316",
          hover: "#EA580C",
          light: "#FFF7ED",
          border: "#FFEDD5",
        },
        brandGreen: {
          DEFAULT: "#16A34A",
          dark: "#0E8345",
          light: "#F0FDF4",
          border: "#DCFCE7",
        },
        navy: {
          950: "#071529",
          900: "#0F294A",
          800: "#173B68",
          700: "#1E4C85",
          600: "#2563EB",
          100: "#E6EEF8",
          50: "#F1F6FC",
        },
        accent: {
          600: "#EA580C",
          500: "#F97316",
          400: "#FB923C",
          100: "#FFEDD5",
          50: "#FFF7ED",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 6px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
