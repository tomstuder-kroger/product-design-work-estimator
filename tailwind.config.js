/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'discovery': '#3B82F6',
        'define': '#8B5CF6',
        'design': '#10B981',
      },
    },
  },
  plugins: [],
}
