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
        primary: {
          DEFAULT: "#8B5CF6",
          dark: "#7C3AED",
          light: "#EDE9FE",
          border: "#DDD6FE",
        },
        brandBg: "#F5F3FF",
        brandCard: "#FFFFFF",
        reaction: {
          fire: {
            DEFAULT: "#F0997B",
            bg: "#FAECE7",
            text: "#993C1D",
          },
          heart: {
            DEFAULT: "#ED93B1",
            bg: "#FBEAF0",
            text: "#993556",
          },
          think: {
            DEFAULT: "#AFA9EC",
            bg: "#EEEDFE",
            text: "#3C3489",
          },
        },
        tag: {
          politics: { bg: "#FAECE7", text: "#993C1D" },
          education: { bg: "#EAF3DE", text: "#3B6D11" },
          jobs: { bg: "#FAEEDA", text: "#854F0B" },
          society: { bg: "#EEEDFE", text: "#534AB7" },
          culture: { bg: "#E6F1FB", text: "#185FA5" },
          environment: { bg: "#E1F5EE", text: "#0F6E56" },
          new: { bg: "#FAEEDA", text: "#854F0B" },
        }
      },
      borderRadius: {
        card: "16px",
        inner: "8px",
        pill: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
