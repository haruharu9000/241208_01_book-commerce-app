import Link from "next/link";
import React from "react";
import Image from "next/image";

const Sidebar = () => {
  return (
    <aside className="w-80 bg-slate-50 min-h-screen p-6 border-l border-gray-200">
      {/* プロフィールセクション */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col items-center">
          <Image
            src="/default_icon.png"
            alt="プロフィール画像"
            width={80}
            height={80}
            className="rounded-full mb-4"
          />
          <h2 className="font-bold text-lg mb-2">hoge</h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            技術ブログを運営しています。Web開発、AI、プログラミングについて発信しています。
          </p>
        </div>
      </div>

      {/* 検索バー */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="search"
            placeholder="記事を検索..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-2.5">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* カテゴリ一覧 */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4">カテゴリー</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/category/programming"
              className="flex items-center justify-between text-gray-700 hover:text-blue-600"
            >
              <span>プログラミング</span>
              <span className="text-sm text-gray-500">(12)</span>
            </Link>
          </li>
          <li>
            <Link
              href="/category/web"
              className="flex items-center justify-between text-gray-700 hover:text-blue-600"
            >
              <span>Web開発</span>
              <span className="text-sm text-gray-500">(8)</span>
            </Link>
          </li>
          <li>
            <Link
              href="/category/ai"
              className="flex items-center justify-between text-gray-700 hover:text-blue-600"
            >
              <span>AI・機械学習</span>
              <span className="text-sm text-gray-500">(5)</span>
            </Link>
          </li>
          <li>
            <Link
              href="/category/infrastructure"
              className="flex items-center justify-between text-gray-700 hover:text-blue-600"
            >
              <span>インフラ</span>
              <span className="text-sm text-gray-500">(3)</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* アーカイブ */}
      <div>
        <h3 className="font-bold text-lg mb-4">アーカイブ</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/archive/2024-02"
              className="flex items-center justify-between text-gray-700 hover:text-blue-600"
            >
              <span>2025年2月</span>
              <span className="text-sm text-gray-500">(4)</span>
            </Link>
          </li>
          <li>
            <Link
              href="/archive/2024-01"
              className="flex items-center justify-between text-gray-700 hover:text-blue-600"
            >
              <span>2025年1月</span>
              <span className="text-sm text-gray-500">(6)</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar; 