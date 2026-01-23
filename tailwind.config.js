/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        slideInRight: {
          'from': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}