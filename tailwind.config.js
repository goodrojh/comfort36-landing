/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Светлые шалфейные поверхности и зелёный акцент бренда
        cream: '#EFFAF4',
        sand: '#DBF3E6',
        linen: '#F9FDFA',
        ink: '#093B24',
        graphite: '#24533C',
        muted: '#446852',
        primary: '#0E653E',
        primarysoft: '#69E6AE',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
