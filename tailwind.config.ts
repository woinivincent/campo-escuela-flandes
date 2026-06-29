import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rojo institucional (del logo)
        flandes: {
          red: "#D52B1E",
          "red-dark": "#A81F16",
          "red-light": "#E85C50",
        },
        // Dorado / amarillo institucional (del logo)
        gold: {
          DEFAULT: "#F2B705",
          dark: "#C99404",
          light: "#FAD45E",
        },
        // Verdes naturales (tema campo/naturaleza)
        forest: {
          DEFAULT: "#2F6B3C",
          dark: "#1E4527",
          light: "#5FA06E",
          pale: "#E8F1E9",
        },
        // Fondos cálidos/naturales
        sand: {
          DEFAULT: "#F7F4EC",
          dark: "#EDE7D8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,69,39,0.04), 0 8px 24px -12px rgba(30,69,39,0.18)",
        "card-hover": "0 2px 4px rgba(30,69,39,0.06), 0 16px 40px -16px rgba(30,69,39,0.28)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
