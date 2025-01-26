/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'], // 'content' instead of 'purge'
  darkMode: 'media', // or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#64748B',
      },
    },
  },
  plugins: [
    import('@tailwindcss/typography'),
  ],
}

