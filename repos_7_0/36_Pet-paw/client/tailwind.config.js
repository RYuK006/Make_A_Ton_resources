/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "url('D:/make-a-ton/petpaw/client/src/images/pngegg.png')"
      },
      fontFamily:{
        "poppins": ["Poppins","sans-serif"]
      }
    },
  },
  plugins: [],
}