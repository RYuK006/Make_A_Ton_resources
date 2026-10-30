/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust according to your file types
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#1cb0f6",
        "primary-green": "#58cc02",
        "primary-red": "#ff4b4b",
        "primary-orange": "#ff9600",
        "primary-violet": "#ce82ff",
      },
    },
  },
  plugins: [],
};