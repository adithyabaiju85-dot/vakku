import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00FFA3", // Neon Cyber Green
          dark: "#00CC82",
          light: "rgba(0, 255, 163, 0.1)",
          border: "rgba(0, 255, 163, 0.3)",
        },
        brandBg: "#000000", // Pure black
        brandCard: "#0A0A0A", // Extremely dark grey
        reaction: {
          fire: {
            DEFAULT: "#FF3D00",
            bg: "rgba(255, 61, 0, 0.1)",
            text: "#FF6E40",
          },
          heart: {
            DEFAULT: "#F50057",
            bg: "rgba(245, 0, 87, 0.1)",
            text: "#FF4081",
          },
          think: {
            DEFAULT: "#D500F9",
            bg: "rgba(213, 0, 249, 0.1)",
            text: "#E040FB",
          },
        },
        tag: {
          politics: { bg: "rgba(255, 61, 0, 0.1)", text: "#FF3D00" },
          education: { bg: "rgba(0, 255, 163, 0.1)", text: "#00FFA3" },
          jobs: { bg: "rgba(255, 196, 0, 0.1)", text: "#FFC400" },
          society: { bg: "rgba(213, 0, 249, 0.1)", text: "#D500F9" },
          culture: { bg: "rgba(245, 0, 87, 0.1)", text: "#F50057" },
          environment: { bg: "rgba(0, 230, 118, 0.1)", text: "#00E676" },
          new: { bg: "rgba(255, 196, 0, 0.1)", text: "#FFC400" },
        }
      },
      borderRadius: {
        card: "32px",
        inner: "16px",
        pill: "9999px",
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
