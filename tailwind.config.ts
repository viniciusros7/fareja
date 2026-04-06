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
        brand: {
          50: "#FFF9F0",
          100: "#FAEEDA",
          200: "#F5D9A8",
          300: "#EFC475",
          400: "#EF9F27",
          500: "#BA7517",
          600: "#854F0B",
          700: "#633806",
          800: "#412402",
          900: "#2A1701",
        },
        forest: {
          50: "#F0F7EA",
          100: "#D8EBCA",
          200: "#B5D88E",
          300: "#97C459",
          400: "#639922",
          500: "#3B6D11",
          600: "#27500A",
          700: "#1B3A07",
          800: "#112504",
          900: "#0A1602",
        },
        earth: {
          50: "#FAF8F5",
          100: "#F2EDE5",
          200: "#E5DDD0",
          300: "#D4C7B0",
          400: "#B8A485",
          500: "#8B7355",
          600: "#6B563E",
          700: "#4D3D2B",
          800: "#33281C",
          900: "#1F180F",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "fareja": "12px",
      },
    },
  },
  plugins: [],
};

export default config;
