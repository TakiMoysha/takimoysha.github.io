/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,md,mdx,ts,vue}"],
  darkMode: "class",
  theme: {},
  plugins: [require("@tailwindcss/typography")],
};
