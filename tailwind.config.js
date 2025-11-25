/** @type {import('tailwindcss').Config} */
export default {
  // Note: Dans cet environnement, les fichiers sont à la racine. 
  // Dans un projet Vite standard, ce serait "./index.html", "./src/**/*.{js,ts,jsx,tsx}"
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}