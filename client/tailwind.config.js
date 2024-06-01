/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '4rem',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      tv: '1660px',
      mobile: '440px',
    },
    extend: {
      boxShadow: {
        '3xl': '-1px 34px 47px -29px rgb(32 32 32 / 100%)',
        '4xl': ' 0vw 0vw 0.5vw 0vw rgb(32 32 32 / 20%)',
        '5xl': ' 0vw 0.5vw 0.5vw 0vw rgb(32 32 32 / 16%)',
        glass: '1px 5px 12px 1px rgba( 31, 38, 135, 0.37 )',
        'glass-card': '4px 4px 4px 4px rgba( 32, 32, 32, 0.37 )',
        'card-shadow': '0px 1px 10px 0px rgba( 31, 38, 135, 0.37 )',
        'dark-shadow': '10px 10px 5px 0px rgba(130,130,130,0.75)',
      },
      height: {},
      colors: {
        background: {
          DEFAULT: '#FFFAF5', //background
        },
        primary: {
          DEFAULT: '#333329',
          50: '#898784', // text
          100: '#A6A69A', //confirm button
          200: '#404040', //disable button
          300: '#FFFFEC', //primary feteh
          400: '#E4E4B0', //modals
          500: '#FF522C', //delete
        },
      },
    },
  },

  plugins: [],
}
