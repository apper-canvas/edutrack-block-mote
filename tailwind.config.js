/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        secondary: {
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
        accent: {
          500: '#0ea5e9',
          600: '#0284c7',
        },
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#0284c7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}