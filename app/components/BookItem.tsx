"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
  user: User;
};

const BookItem = ({ book, isPurchased, user }: BookProps) => {
  const router = useRouter();

  const handlePurchaseClick = () => {
    if (isPurchased) {
      alert("その商品は購入済みです。");
    } else {
      if (!user) {
        router.push("/api/auth/signin");
      } else {
        // 購入処理
        console.log("購入処理開始");
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-6 p-4 border-b">
      {/* 画像 */}
      <Image
        src={book.thumbnail.url}
        alt={book.title}
        width={160}
        height={100}
        className="rounded-lg object-cover"
      />

      {/* テキスト部分 */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p className="text-gray-600">{book.description}</p>

        {/* 有料記事のみ価格を表示 */}
        {book.price > 0 && (
          <p className="text-gray-800 font-bold mt-2">価格: {book.price}円</p>
        )}

        <button
          onClick={handlePurchaseClick}
          className="mt-2 text-blue-500 hover:underline"
        >
          {isPurchased ? "購入済み" : "購入する"}
        </button>
      </div>
    </div>
  );
};

export default BookItem;