import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media', // システム設定に応じて自動切り替え
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f9d3d3',
          300: '#f4b3b3',
          400: '#ec8585',
          500: '#e25a5a',
          600: '#d13a3a',
          700: '#b02a2a',
          800: '#8a2a28',
          900: '#6a1917',
          950: '#4a0f0d',
        },
        cream: {
          50: '#fefefe',
          100: '#fdfcfb',
          200: '#faf8f5',
          300: '#f5f3f0',
          400: '#ede9e4',
          500: '#e0d9d1',
          600: '#d1c7bc',
          700: '#b8a99a',
          800: '#9a8b7c',
          900: '#7f7265',
          950: '#433d35',
        }
      }
    },
  },
  plugins: [],
}

export default config;
