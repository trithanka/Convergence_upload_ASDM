/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-text': '#0b1419',
        'theme-background': '#f9fbfd',
        'theme-primary': '#054C7C',
        'theme-secondary': '#d4a69c',
        'theme-accent': '#bbc57b',
        'theme-primary-hover': '#044068',  
        'theme-primary-active': '#033252',
       },
    },
  },
  plugins: [],
}