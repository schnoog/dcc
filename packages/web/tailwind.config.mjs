/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        midnight: "#27212e",
        midnightLight: "#4d4655",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
