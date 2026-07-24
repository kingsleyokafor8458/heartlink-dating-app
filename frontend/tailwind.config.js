/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f6',
          100: '#ffe0ed',
          200: '#ffb8d6',
          300: '#ff8ab8',
          400: '#ff5a9c',
          500: '#ec1a6e',   // main hot pink/rose
          600: '#d40f5c',
          700: '#b30b4c',
          800: '#8f0d40',
          900: '#1a1533'    // deep navy for headings
        }
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
