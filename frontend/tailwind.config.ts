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
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
