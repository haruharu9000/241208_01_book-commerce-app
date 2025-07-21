import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // 手動でダークモード切り替え
  theme: {
    extend: {
      colors: {
        elegant: {
          // 基本色（シックで上品な色調）
          primary: '#2c2c2e',        // 深いチャコールグレー
          accent: '#2c5530',         // 上品なディープフォレストグリーン（アクセント）
          highlight: '#f8f8f9',      // 極淡いグレーホワイト
          warmAccent: '#6b7c87',     // 上品なスレートブルーグレー
          redAccent: '#8b3538',      // サイトタイトル用の上品な深い赤
          blueHover: '#4a90a4',      // カテゴリーホバー用の明るい青

          // ライトモード（シックでエレガント）
          lightBg: '#fafafa',        // 極淡いグレーホワイト
          lightCard: '#ffffff',      // 純白のカード背景
          lightText: '#1a1a1c',      // 深いチャコール
          lightMuted: '#6d6d70',     // 上品なミディアムグレー

          // ダークモード（洗練されたダーク）
          darkBg: '#1c1c1e',         // 洗練されたダークグレー
          darkCard: '#2c2c2e',       // カード背景用チャコール
          darkText: '#f2f2f7',       // 明るいオフホワイト
          darkMuted: '#aeaeb2',      // 明るめのグレー
          darkAccent: '#5fb3a3',     // ダークモード用の明るいティール
          darkRedAccent: '#ff6b73',  // ダークモード用の明るい赤
          darkBlueHover: '#7bb3c7',  // ダークモード用の明るい青
        },
        forestGreen: {
          50: '#f0f9f0',
          100: '#ddf2dd',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5cb85c',
          500: '#3a9c3a',
          600: '#2c7a2c',
          700: '#2c5530',
          800: '#254725',
          900: '#1f3b1f',
          950: '#0d1f0d',
        },
        sophisticatedRed: {
          50: '#fdf2f2',
          100: '#fce8e8',
          200: '#f9d5d5',
          300: '#f4b0b0',
          400: '#ec7f7f',
          500: '#e15555',
          600: '#cd3a3a',
          700: '#b02d2d',
          800: '#8b3538',
          900: '#732e2e',
          950: '#3e1515',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        }
      }
    },
  },
  plugins: [],
}

export default config;
