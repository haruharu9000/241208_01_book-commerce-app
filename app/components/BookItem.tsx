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
      <div className="flex bg-white rounded-lg overflow-hidden shadow-md">
        {book.thumbnail && (
          <div className="w-1/4 min-w-[200px]">
            <div className="relative w-full pt-[75%]">
              <Image
                src={book.thumbnail.url}
                alt={book.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-l-lg"
              />
            </div>
          </div>
        )}
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-600 mb-4">{book.description}</p>
          <div className="mt-auto">
            {typeof book.price === "number" && book.price > 0 && (
              <div className="flex items-center">
                <p className="text-lg font-bold text-blue-600">
                  ¥{book.price.toLocaleString()}
                </p>
                <span
                  className={`ml-4 ${isPurchased ? "text-green-600" : "text-blue-600 hover:text-blue-800"}`}
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
