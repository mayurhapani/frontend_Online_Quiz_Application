/** @type {import('tailwindcss').Config} */
export default {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          600: "#1E40AF",
          700: "#1E3A8A",
          800: "#1E3A8A",
        },
        gray: {
          100: "#F3F4F6",
          900: "#111827",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
