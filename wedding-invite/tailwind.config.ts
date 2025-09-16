import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F1EA",
        sand: "#E8D8C8",
        peach: "#F1E3D3",
        cocoa: "#6D4C41",
        coffee: "#5A3E36",
        ink: "#2B2A2A",
      },
      borderRadius: {
        xl: "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;


