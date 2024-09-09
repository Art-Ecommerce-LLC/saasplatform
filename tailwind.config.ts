import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom-md': '829px', // Custom Breakpoint Header
        'custom-520': '520px', // Custom Breakpoint Footer
      },
    },
  },
  plugins: [],
};
export default config;
