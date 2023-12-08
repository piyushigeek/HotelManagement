/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    screens: {
      max_xl: { max: "1300px" },
      max_md: { max: "980px" },
      max_720: { max: "720px" },
      max_sm: { max: "500px" },
    },
  },
  plugins: [],
}

