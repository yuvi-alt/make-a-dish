import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#FFF9F3",
          "warm-white": "#FAF7F2",
          butter: "#FFE7C2",
          peach: "#FFC8A9",
          tangerine: "#FF8A5C",
          honey: "#F7B267",
          blush: "#FCE5D5",
          fog: "#E8DCCF",
          cocoa: "#4A2C23",
          charcoal: "#2B1A14",
          moss: "#275D45",
          sprout: "#62C295",
          mint: "#C7E8D4",
        },
        accent: {
          leaf: "#46A679",
          basil: "#1D6A4D",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Space Grotesk", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "1.125rem",
        xl: "1.75rem",
        "2xl": "2.5rem",
      },
      boxShadow: {
        brand: "0px 25px 80px rgba(43, 26, 20, 0.16)",
        "brand-soft": "0px 12px 30px rgba(43, 26, 20, 0.12)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(255, 231, 194, 0.9), transparent 55%), radial-gradient(circle at bottom right, rgba(99, 194, 149, 0.25), transparent 45%)",
        "card-warm":
          "linear-gradient(135deg, rgba(255, 231, 194, 0.85), rgba(255, 200, 169, 0.85))",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floaty: "floaty 12s ease-in-out infinite",
        fadeUp: "fadeUp 0.8s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
