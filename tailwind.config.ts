/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#f2cb8a',
          light: '#f8e8c8',
          bg: '#fcf5ec',
          panel: '#e6c27a', // opcional para contrastes
          paper: '#fffaf3', // opcional p/ cartões
        },
      },
    },
  },
  plugins: [],
};
