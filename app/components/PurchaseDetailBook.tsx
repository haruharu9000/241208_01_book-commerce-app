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
      className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none"
    >
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg overflow-hidden">
        {purchaseDetailBook.thumbnail && (
          <Image
            priority
            src={purchaseDetailBook.thumbnail.url}
            alt={purchaseDetailBook.title}
            width={400}
            height={300}
            className="w-full md:w-1/3 object-cover"
          />
        )}
        <div className="p-6 md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">
            {purchaseDetailBook.title}
          </h2>
          <p className="text-gray-600 mb-4">{purchaseDetailBook.description}</p>
          <p className="text-lg font-bold">
            価格：
            {typeof purchaseDetailBook.price === "number"
              ? purchaseDetailBook.price.toLocaleString()
              : 0}
            円
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PurchaseDetailBook;
