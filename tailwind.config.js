/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Светлые шалфейные поверхности и зелёный акцент бренда
        cream: '#EFF6F0',
        sand: '#E1EEE3',
        linen: '#F9FDF9',
        ink: '#132B21',
        graphite: '#2E4B3D',
        muted: '#4C6657',
        primary: '#1D704D',
        primarysoft: '#9EDBB5',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
