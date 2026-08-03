/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // светлая палитра ателье: тёплая слоновая кость + карамельная строчка
        cream: '#F6F2E9',
        sand: '#EBE4D6',
        linen: '#FFFDF7',
        ink: '#191510',
        graphite: '#3E382E',
        muted: '#7A7263',
        primary: '#B07B3E', // карамельная нить — акцент
        primarysoft: '#D9B27C',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
}
