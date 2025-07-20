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
          // 基本色（統一感のある上品な色調）
          primary: '#6b4c3b',        // 上品な深いブラウン（赤み少なめ）
          accent: '#a68f79',         // 落ち着いたサンドベージュ
          highlight: '#dcd2c1',      // 柔らかく上品なハイライトカラー
          warmAccent: '#b8936f',     // 温かみのあるマルーン寄りアクセント

          // ライトモード（温かみのある上品な色調）
          lightBg: '#f7f3ed',        // より温かみのあるアイボリー
          lightCard: '#ffffff',      // 純白のカード背景
          lightText: '#2f1f16',      // 濃すぎず読みやすいブラウン
          lightMuted: '#9c8e81',     // サブテキストやボーダー向け

          // ダークモード（軽やかで優雅な色調）
          darkBg: '#2a2320',         // より軽やかなダークブラウン
          darkCard: '#3d352f',       // 温かみのあるカード背景
          darkText: '#f0e8df',       // 柔らかく上品なアイボリー
          darkMuted: '#c4b5a7',      // 明るめのミューテッド色
          darkAccent: '#d4a574',     // マルーン寄りの温かいアクセント
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
