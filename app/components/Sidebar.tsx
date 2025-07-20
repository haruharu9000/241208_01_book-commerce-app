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
      <div className="space-y-3 sm:space-y-6">
        {/* プロフィールセクション */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-3 sm:p-6 transition-colors duration-300">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative w-12 h-12 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/profile-icon.jpg"
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full"
              />
            </div>
            <div className="text-left">
              <h2 className="text-sm sm:text-2xl font-bold text-elegant-lightText dark:text-elegant-darkText">
                haruaki
              </h2>
              <p className="text-xs sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted">
                Next.jsとMicroCMSを使ってブログを構築してます。
              </p>
            </div>
          </div>
        </div>

        {/* 検索バー */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-3 sm:p-6 transition-colors duration-300">
          <SearchBar />
        </div>

        {/* カテゴリー */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-3 sm:p-6 transition-colors duration-300">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-elegant-lightText dark:text-elegant-darkText">
            カテゴリー
          </h2>
          <ul className="space-y-1 sm:space-y-2">
            {categories.map((category: Category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.id}`}
                  className="flex justify-between items-center text-sm sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted hover:text-elegant-primary dark:hover:text-elegant-accent transition-colors"
                >
                  <span>
                    {category.id === "worksummary" ? "日報" : category.name}
                  </span>
                  <span className="text-xs sm:text-sm">
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

        {/* アーカイブ */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-3 sm:p-6 transition-colors duration-300">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-elegant-lightText dark:text-elegant-darkText">
            アーカイブ
          </h2>
          <ul className="space-y-1 sm:space-y-2">
            {sortedMonths.map((month) => (
              <li key={month}>
                <Link
                  href={`/archive/${month}`}
                  className="flex justify-between items-center text-sm sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted hover:text-elegant-primary dark:hover:text-elegant-accent transition-colors"
                >
                  <span>{month}</span>
                  <span className="text-xs sm:text-sm">
                    ({groupedBooks[month].length})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Sidebar error:", error);
    return (
      <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-6 transition-colors duration-300">
        <p className="text-elegant-lightMuted dark:text-elegant-darkMuted">
          データの読み込みでエラーが発生しました
        </p>
      </div>
    );
  }
};

export default Sidebar;
