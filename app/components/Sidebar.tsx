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
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* プロフィールセクション */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-4 sm:p-4 md:p-6 transition-colors duration-300">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative w-14 h-14 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/profile-icon.jpg"
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full"
              />
            </div>
            <div className="text-left">
              <h2 className="text-base sm:text-2xl font-bold text-elegant-lightText dark:text-elegant-darkText mb-2">
                haruaki
              </h2>
              <p className="text-xs sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted">
                Next.jsとMicroCMS
                <br />
                でブログ構築中です
              </p>
            </div>
          </div>
        </div>

        {/* 検索バー */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-4 sm:p-6 md:p-8 transition-colors duration-300">
          <SearchBar />
        </div>

        {/* カテゴリー */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-4 sm:p-6 md:p-8 transition-colors duration-300">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-elegant-lightText dark:text-elegant-darkText">
            カテゴリー
          </h2>

          <ul className="space-y-2 sm:space-y-3">
            {categories.map((category: Category) => {
              const displayNames: { [key: string]: string } = {
                worksummary: "日報",
                programming: "プログラミング",
                // 必要に応じて追加（例: design: "デザイン"）
              };

              return (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className="flex justify-between items-center text-sm sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted hover:text-elegant-lightGreenHover dark:hover:text-elegant-darkBlueHover transition-colors py-1"
                  >
                    <span>{displayNames[category.id] || category.name}</span>
                    <span className="text-xs sm:text-sm">
                      (
                      {category.count ||
                        contents.filter(
                          (book: BookType) => book.categoryId === category.id
                        ).length}
                      )
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* アーカイブ */}
        <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-md p-4 sm:p-6 md:p-8 transition-colors duration-300">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-elegant-lightText dark:text-elegant-darkText">
            アーカイブ
          </h2>
          <ul className="space-y-2 sm:space-y-3">
            {sortedMonths.map((month) => (
              <li key={month}>
                <Link
                  href={`/archive/${month}`}
                  className="flex justify-between items-center text-sm sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted hover:text-elegant-lightGreenHover dark:hover:text-elegant-darkBlueHover transition-colors py-1"
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
