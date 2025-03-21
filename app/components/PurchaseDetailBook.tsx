import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookType } from "../types/types";

type purchaseDetailBookProps = {
  purchaseDetailBook: BookType;
};

const PurchaseDetailBook = ({
  purchaseDetailBook,
}: purchaseDetailBookProps) => {
  return (
    <Link
      href={`/book/${purchaseDetailBook.id}`}
      className="block hover:opacity-80 mb-4"
    >
      <div className="flex bg-white rounded-lg overflow-hidden shadow-md w-full max-w-5xl mx-auto">
        {purchaseDetailBook.thumbnail && (
          <div className="w-1/5 min-w-[200px]">
            <div className="relative w-full pt-[75%]">
              <Image
                src={purchaseDetailBook.thumbnail.url}
                alt={purchaseDetailBook.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-l-lg"
              />
            </div>
          </div>
        )}
        <div className="flex-1 p-6">
          <h2 className="text-lg font-bold mb-2">{purchaseDetailBook.title}</h2>
          <p className="text-gray-600 text-sm mb-3">
            {purchaseDetailBook.description}
          </p>
          <div className="mt-auto">
            <div className="flex items-center">
              <p className="text-base font-bold text-blue-600">
                ¥{purchaseDetailBook.price?.toLocaleString() ?? 0}
              </p>
              <span className="text-sm text-green-600 ml-2">購入済み</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PurchaseDetailBook;
