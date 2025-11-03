/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // deep blue-black
        accent: "#38bdf8", // futuristic cyan
        highlight: "#a855f7", // glowing violet
      },
    },
  },
  plugins: [],
}
