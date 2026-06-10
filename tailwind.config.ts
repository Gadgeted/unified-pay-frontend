import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // East African Payment Brand Colors
        mpesa: {
          DEFAULT: "#49aa44", // Safaricom Green
          hover: "#3d8f38",
          light: "#eef7ee",
        },
        airtel: {
          DEFAULT: "#ff0000", // Airtel Red
          hover: "#d90000",
          light: "#fff0f0",
        },
        crypto: {
          DEFAULT: "#2775ca", // USDC/Blockchain Blue
          hover: "#1e5fa5",
          light: "#eef5fc",
        },
        background: "#f8fafc",
        foreground: "#0f172a",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;