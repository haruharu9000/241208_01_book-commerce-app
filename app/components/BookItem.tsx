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
      <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
        <div className="flex-1 p-3 md:p-6 flex flex-col">
          <div className="mb-2 md:mb-4">
            <h2 className="text-base md:text-xl font-bold mb-1 md:mb-2 text-gray-900 leading-tight">
              {book.title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-none">
              {book.description}
            </p>
          </div>
          <div className="mt-auto">
            {typeof book.price === "number" && book.price > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm md:text-lg font-bold text-[#6a1917]">
                  ¥{book.price.toLocaleString()}
                </p>
                <span
                  className={`text-xs md:text-base px-2 md:px-3 py-1 rounded-full ${
                    isPurchased
                      ? "text-green-600 bg-green-50"
                      : "text-[#6a1917] bg-[#faf8f5] hover:bg-[#f5f3f0]"
                  }`}
                >
                  {isPurchased ? "購入済み" : "購入する"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
