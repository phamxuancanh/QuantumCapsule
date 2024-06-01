/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      translate: ['responsive', 'group-hover', 'hover', 'focus'],
      transitionProperty: ['responsive', 'motion-safe', 'motion-reduce']
    }
  },
}

