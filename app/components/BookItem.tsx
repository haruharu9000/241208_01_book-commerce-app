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
    <Link href={`/book/${book.id}`} className="block">
      <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {book.thumbnail && (
          <div className="relative w-full h-40">
            <Image
              src={book.thumbnail.url}
              alt={book.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-lg"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">{book.title}</h2>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {book.description}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">
              {typeof book.price === "number" && book.price === 0
                ? "無料"
                : typeof book.price === "number"
                  ? `¥${book.price.toLocaleString()}`
                  : "¥0"}
            </p>
            {isPurchased && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                購入済み
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
