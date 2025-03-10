/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#4a6bff",
        secondary: "#f5f5f5",
      },
      boxShadow: {
        default: "0 2px 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
