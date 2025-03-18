"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
  user: User | null; // user が null の場合も考慮
};

const BookItem = ({ book, isPurchased, user }: BookProps) => {
  const router = useRouter();

  const handleBookClick = () => {
    if (!user) {
      // ユーザーがログインしていない場合はログインページへ
      router.push("/api/auth/signin");
      return;
    }

    if (book.price === 0 || isPurchased) {
      // 無料記事 または 購入済みなら 記事ページへ
      router.push(`/book/${book.id}`);  // すべての記事を /book/[id] で表示
    } else {
      // 有料記事なら決済ページへ
      router.push(`/book/${book.id}`);
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
        {(book.price ?? 0) > 0 && (
          <p className="text-gray-800 font-bold mt-2">価格: {book.price}円</p>
        )}

        {/* 有料かつ未購入の場合のみ「購入する」ボタンを表示 */}
        {(book.price ?? 0) > 0 && !isPurchased && (
          <button className="mt-2 text-blue-500 hover:underline">
            購入する
          </button>
        )}
      </div>
    </div>
  );
};

export default BookItem;
