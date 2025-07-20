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
          // 基本色
          primary: '#6b4c3b',        // 上品な深いブラウン（赤み少なめ）
          accent: '#a68f79',         // 落ち着いたサンドベージュ
          highlight: '#dcd2c1',      // 柔らかく上品なハイライトカラー

          // ライトモード
          lightBg: '#f5f1ec',        // アイボリー寄りの背景（柔らか）
          lightText: '#2f1f16',      // 濃すぎず読みやすいブラウン
          lightMuted: '#9c8e81',     // サブテキストやボーダー向け

          // ダークモード
          darkBg: '#1d1815',         // 黒に近いビターブラウン
          darkCard: '#2c2420',       // コンテンツ背景用（柔らか暗め）
          darkText: '#e9e2dc',       // アイボリー系のやさしい文字色
          darkMuted: '#b4a59b',      // サブテキストや説明に最適
        },
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
