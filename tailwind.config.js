/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        Ibrand: ['Ibrand', 'sans-serif'],
        Access: ['Access', 'sans-serif'],
        proxima: ['Proxima Nova', 'sans-serif'],

      },
      colors: {
        'custom-purple': '#78206E',
      },
      animation: {
        'spin-slow': 'rotate-slow 20s linear infinite',
      },
      keyframes: {
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },

      },

    },
    plugins: [],
  }
}