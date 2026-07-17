/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary/Brand colors (Kroger blue)
        primary: 'rgb(var(--brand-moreProminent-rgb))',
        'primary-dark': 'rgb(var(--brand-mostProminent-rgb))',
        'primary-light': 'rgb(var(--brand-lessProminent-rgb))',

        // Stage colors
        discovery: 'rgb(var(--brand-moreProminent-rgb))',
        define: 'rgb(var(--special-lessProminent-rgb))',
        design: 'rgb(var(--positive-lessProminent-rgb))',

        // Semantic colors
        success: 'rgb(var(--positive-lessProminent-rgb))',
        warning: 'rgb(var(--callout-lessProminent-rgb))',
        error: 'rgb(var(--negative-lessProminent-rgb))',

        // Neutral colors (grays)
        gray: {
          50: 'rgb(var(--neutral-mostSubtle-rgb))',
          100: 'rgb(var(--neutral-moreSubtle-rgb))',
          200: 'rgb(var(--neutral-lessSubtle-rgb))',
          300: 'rgb(var(--neutral-leastSubtle-rgb))',
          400: 'rgb(var(--neutral-leastProminent-rgb))',
          500: 'rgb(var(--neutral-lessProminent-rgb))',
          600: 'rgb(var(--neutral-moreProminent-rgb))',
          700: 'rgb(var(--neutral-mostProminent-rgb))',
          900: 'rgb(var(--system-text-rgb))',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
