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
      <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-sm md:max-w-none">
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
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          <div className="mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 leading-tight">
              {book.title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {book.description}
            </p>
          </div>
          <div className="mt-auto">
            {typeof book.price === "number" && book.price > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-base md:text-lg font-bold text-blue-600">
                  ¥{book.price.toLocaleString()}
                </p>
                <span
                  className={`text-sm md:text-base px-3 py-1 rounded-full ${
                    isPurchased
                      ? "text-green-600 bg-green-50"
                      : "text-blue-600 bg-blue-50 hover:bg-blue-100"
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
