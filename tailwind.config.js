/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

        minHeight: {
          '646' : '646px',
        },
        scrollBehavior: ['responsive', 'scroll-smooth'],

        width:{
          'cardWidth' : '456px',
          'Logo' : '160px'
        },
        height:{
          'cardHeight' : '64px',
        },
        zIndex:{
          '1' : '1',
        },
        
        backgroundColor:{
          'main' : '#01915A'
        },
        fontSize: {
         '60' : '60px'
                }
    },
  },
  variants: {},
  plugins: [],
}