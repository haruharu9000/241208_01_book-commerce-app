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
import SearchBar from "./SearchBar";

const Sidebar = async () => {
  try {
    const { contents } = await getAllBooks();
    const categories = await getCategories();
    const { groupedBooks, sortedMonths } = await getBooksByMonth();

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* プロフィールセクション */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/profile-icon.jpg"
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full"
              />
            </div>
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold">haruaki</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Next.jsとMicroCMSを使ってブログを構築してます。
              </p>
            </div>
          </div>
        </div>

        {/* 検索バー */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <SearchBar />
        </div>

        {/* カテゴリー */}
        {categories.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              カテゴリー
            </h2>
            <ul className="space-y-2">
              {categories.map((category: Category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className="flex justify-between items-center text-gray-700 hover:text-blue-600 text-sm sm:text-base"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs sm:text-sm text-gray-500">
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
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              アーカイブ
            </h2>
            <ul className="space-y-2">
              {sortedMonths.map((month) => (
                <li key={month}>
                  <Link
                    href={`/archive/${month}`}
                    className="flex justify-between items-center text-gray-700 hover:text-blue-600 text-sm sm:text-base"
                  >
                    <span>{month}</span>
                    <span className="text-xs sm:text-sm text-gray-500">
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
    console.error("Sidebar error:", error);
    return <div>エラーが発生しました</div>;
  }
};

export default Sidebar;
