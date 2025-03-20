"use client";

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
    <div className="flex flex-col h-full">
      {book.thumbnail && (
        <div className="relative w-full h-48">
          <Image
            src={book.thumbnail.url}
            alt={book.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg"
          />
        </div>
      )}
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-bold mb-2">{book.title}</h2>
        <p className="text-gray-600 mb-4">{book.description}</p>
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
  );
}
