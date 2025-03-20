import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  getCategories,
  getAllBooks,
  getBooksByMonth,
} from "@/app/lib/microcms/client";
import { Category } from "@/app/types/types";
import { BookType } from "../types/types";

const Sidebar = async () => {
  try {
    const { contents } = await getAllBooks();
    const { groupedBooks, sortedMonths } = await getBooksByMonth();
    const categories = await getCategories();

    return (
      <div className="space-y-6">
        {/* プロフィールセクション */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 relative rounded-full overflow-hidden">
              <Image
                src="/default-avatar.png"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">hoge</h2>
              <p className="text-gray-600 text-sm">
                知の探求、広告非依存のブログプラットフォームを構築中。
              </p>
            </div>
          </div>
        </div>

        {/* 検索バー */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <input
              type="search"
              placeholder="記事を検索..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-2.5 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* カテゴリー */}
        {categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">カテゴリー</h2>
            <ul className="space-y-2">
              {categories.map((category: Category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className="flex justify-between items-center text-gray-700 hover:text-blue-600"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500">
                      (
                      {
                        contents.filter(
                          (book: BookType) => book.categoryId === category.id
                        ).length
                      }
                      )
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* アーカイブ */}
        {sortedMonths.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">アーカイブ</h2>
            <ul className="space-y-2">
              {sortedMonths.map((month) => (
                <li key={month}>
                  <Link
                    href={`/archive/${month}`}
                    className="flex justify-between items-center text-gray-700 hover:text-blue-600"
                  >
                    <span>{month}</span>
                    <span className="text-sm text-gray-500">
                      ({groupedBooks[month].length})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in Sidebar component:", error);
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-red-500">データの読み込みに失敗しました。</p>
        </div>
      </div>
    );
  }
};

export default Sidebar;
