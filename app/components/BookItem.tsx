"use client";

import Image from "next/image";
import { BookType } from "../types/types";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
};

const BookItem = ({ book, isPurchased}: BookProps) => {
  const router = useRouter();

  const handleBookClick = () => {
    if (book.price > 0 && !isPurchased) {
      // 有料かつ未購入 → 購入画面へ
      router.push(`/checkout/${book.id}`);
    } else {
      // 無料 or 購入済み → 記事内容ページへ
      router.push(`/article/${book.id}`);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-6 p-4 border-b cursor-pointer"
      onClick={handleBookClick}
    >
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

        {/* 有料かつ未購入の場合のみ「購入する」ボタンを表示 */}
        {book.price > 0 && !isPurchased && (
          <button className="mt-2 text-blue-500 hover:underline">
            購入する
          </button>
        )}
      </div>
    </div>
  );
};

export default BookItem;
