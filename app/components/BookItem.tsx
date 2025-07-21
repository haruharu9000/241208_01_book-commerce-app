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
    <Link
      href={`/book/${book.id}`}
      className="block bg-white dark:bg-elegant-darkCard rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-elegant-highlight dark:border-elegant-primary"
    >
      <div className="flex flex-col md:flex-row">
        {book.thumbnail ? (
          <div className="w-full md:w-48 h-48 relative flex-shrink-0">
            <Image
              src={book.thumbnail.url}
              alt={book.title}
              fill
              className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full md:w-48 h-48 bg-elegant-highlight dark:bg-elegant-primary flex-shrink-0 rounded-t-xl md:rounded-l-xl md:rounded-t-none" />
        )}
        <div className="flex-grow min-w-0 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-elegant-lightText dark:text-elegant-darkText leading-tight break-words line-clamp-2">
            {book.title}
          </h2>
          <div className="text-sm md:text-base text-elegant-lightMuted dark:text-elegant-darkMuted line-clamp-3 leading-relaxed break-words overflow-hidden mb-3 md:mb-4">
            {book.content?.replace(/<[^>]*>/g, "").substring(0, 150)}...
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs md:text-sm text-elegant-lightMuted dark:text-elegant-darkMuted">
              {new Date(book.createdAt).toLocaleDateString("ja-JP")}
            </span>
            <div className="flex items-center gap-2 md:gap-3">
              {typeof book.price === "number" && book.price > 0 && (
                <span className="text-xs md:text-sm font-bold text-elegant-lightMuted dark:text-elegant-darkMuted">
                  ¥{book.price.toLocaleString()}
                </span>
              )}
              {isPurchased ? (
                <span className="inline-block bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                  購入済み
                </span>
              ) : (
                typeof book.price === "number" &&
                book.price > 0 && (
                  <span className="inline-block bg-elegant-primary dark:bg-elegant-warmAccent text-elegant-lightBg dark:text-elegant-lightBg text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-elegant-warmAccent dark:hover:bg-elegant-primary transition-colors duration-200">
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
