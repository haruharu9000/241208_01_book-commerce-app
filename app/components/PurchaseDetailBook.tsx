import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookType } from "../types/types";

interface purchaseDetailBookProps {
  purchaseDetailBook: BookType;
}

const PurchaseDetailBook = ({
  purchaseDetailBook,
}: purchaseDetailBookProps) => {
  return (
    <Link
      href={`/book/${purchaseDetailBook.id}`}
      className="block hover:opacity-80 mb-4"
    >
      <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-sm md:max-w-none">
        {purchaseDetailBook.thumbnail && (
          <div className="w-full md:w-1/3 md:min-w-[250px]">
            <div className="relative w-full pt-[75%]">
              <Image
                src={purchaseDetailBook.thumbnail.url}
                alt={purchaseDetailBook.title}
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
              {purchaseDetailBook.title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {purchaseDetailBook.description}
            </p>
          </div>
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <p className="text-base md:text-lg font-bold text-blue-600">
                ¥{purchaseDetailBook.price?.toLocaleString() ?? 0}
              </p>
              <span className="text-sm md:text-base px-3 py-1 rounded-full text-green-600 bg-green-50">
                購入済み
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PurchaseDetailBook;
