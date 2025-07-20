"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  const applyTheme = (dark: boolean) => {
    // HTMLにdarkクラスを追加/削除
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // ビューポート全体の背景色を強制的に更新
    const color = dark ? "#1d1815" : "#f5f1ec";
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;

    // Next.jsのルートコンテナも更新
    const nextRoot = document.getElementById("__next");
    if (nextRoot) {
      nextRoot.style.backgroundColor = color;
    }

    // メインコンテナも更新
    const mainContainer = document.querySelector(".main-container");
    if (mainContainer) {
      (mainContainer as HTMLElement).style.backgroundColor = color;
    }
  };

  useEffect(() => {
    // ローカルストレージからダークモード設定を取得
    const savedTheme = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // 保存された設定があればそれを使用、なければシステム設定を使用
    const initialDark = savedTheme ? savedTheme === "true" : systemPrefersDark;

    setIsDark(initialDark);
    applyTheme(initialDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);

    // ローカルストレージに保存
    localStorage.setItem("darkMode", newDarkMode.toString());

    // テーマを適用
    applyTheme(newDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-lg bg-elegant-accent dark:bg-elegant-darkCard hover:bg-elegant-highlight dark:hover:bg-elegant-primary transition-colors duration-200"
      aria-label="ダークモード切り替え"
    >
      {isDark ? (
        // 太陽アイコン（ライトモードに切り替え）
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-elegant-primary"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // 月アイコン（ダークモードに切り替え）
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-elegant-lightBg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
