/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const config = {
  mode: 'jit',
  purge: ['public/**/*.html', 'src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false,
  theme: {
    extend: {
    }
  },
  variants: {},
  plugins: []
}

module.exports = config
