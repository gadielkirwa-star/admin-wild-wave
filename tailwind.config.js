/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safari: {
          gold: '#D4A574',
          terracotta: '#C17855',
          olive: '#6B7F5C',
          sand: '#E8DCC4',
          cream: '#F5F1E8',
          charcoal: '#2D2D2D',
          brown: '#6B4E3D',
          green: '#4A5D3F'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
