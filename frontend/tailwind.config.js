/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#121212',
          border: '#1f1f1f',
          hover: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}

