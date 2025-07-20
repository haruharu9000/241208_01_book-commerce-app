"use client";

import Link from "next/link";
import Image from "next/image";
import { BookType } from "../types/types";

export default function BookItem({
  book,
  isPurchased,
}: {
  book: BookType;
  isPurchased: boolean;
}) {
  return (
    <Link href={`/book/${book.id}`} className="block hover:opacity-80">
      <div className="flex flex-col md:flex-row bg-white dark:bg-elegant-darkCard rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        {book.thumbnail && (
          <div className="w-full md:w-1/3 md:min-w-[200px] h-48 md:h-auto relative">
            <Image
              src={book.thumbnail.url}
              alt={book.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-xl md:rounded-l-xl md:rounded-t-none"
            />
          </div>
        )}
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-elegant-lightText dark:text-elegant-darkText line-clamp-2">
              {book.title}
            </h2>
            <p className="text-sm sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted line-clamp-3 mb-4 sm:mb-6">
              {book.content?.replace(/<[^>]*>/g, "").substring(0, 150)}...
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm text-elegant-lightMuted dark:text-elegant-darkMuted">
              {new Date(book.createdAt).toLocaleDateString("ja-JP")}
            </span>
            <div className="flex items-center gap-4">
              {/* 価格表示（購入ボタンの左横） */}
              {typeof book.price === "number" && book.price > 0 && (
                <p className="text-sm sm:text-base font-bold text-elegant-primary dark:text-elegant-accent">
                  ¥{book.price.toLocaleString()}
                </p>
              )}
              {isPurchased ? (
                <span className="inline-block bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-3 py-1.5 rounded-full">
                  購入済み
                </span>
              ) : (
                typeof book.price === "number" &&
                book.price > 0 && (
                  <span className="inline-block bg-elegant-primary dark:bg-elegant-accent text-white dark:text-elegant-lightText text-xs px-3 py-1.5 rounded-full hover:bg-elegant-accent dark:hover:bg-elegant-primary transition-colors duration-200">
                    購入する
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
