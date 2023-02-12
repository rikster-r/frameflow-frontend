/*eslint-disable-next-line @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "450px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        logo: ["Cookie", "cursive"],
      },
    },
  },
  plugins: [],
};
