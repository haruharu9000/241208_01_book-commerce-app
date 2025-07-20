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
          <div className="w-full md:w-1/3 md:min-w-[200px]">
            <div className="relative w-full pt-[75%]">
              <Image
                src={book.thumbnail.url}
                alt={book.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-xl md:rounded-l-xl md:rounded-t-none"
              />
            </div>
          </div>
        )}
        <div className="flex-1 p-3 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-elegant-lightText dark:text-elegant-darkText line-clamp-2">
              {book.title}
            </h2>
            <p className="text-sm sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted line-clamp-3 mb-3 sm:mb-4">
              {book.content?.replace(/<[^>]*>/g, "").substring(0, 150)}...
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <span className="text-xs sm:text-sm text-elegant-lightMuted dark:text-elegant-darkMuted">
              {book.createdAt}
            </span>
            {isPurchased && (
              <span className="inline-block bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                購入済み
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
