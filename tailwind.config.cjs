/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aria: {
        invalid: 'invalid="true"',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
