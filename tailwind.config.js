/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const config = {
  mode: 'jit',
  purge: ['public/**/*.html', 'src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false,
  important: true,
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      fontFamily: {
        vazir: 'Vazir',
        irannastaliq: 'IranNastaliq',
        iransans: 'IRANSans',
        yekan: 'Yekan',
        neirizi: 'neirizi'
      },
      colors: {
        'dark-purple': '#4D455D',
        'light-pink': '#E96479',
        'beige': '#F5E9CF',
        'light-blue': '#7DB9B6',
      }
    }
  },
  variants: {},
  plugins: []
}

module.exports = config
