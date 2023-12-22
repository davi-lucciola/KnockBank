/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'white': '#FAFAFA',
      'gray': '#272221',
      'light-gray': '#EDEDED',
      'blue': '#35A3FD',
      'red': '#E25858',
      'green': '#50AF47',
    },
    extend: {},
  },
  plugins: [],
}

