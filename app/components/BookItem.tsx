"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
  user: User | null;
};

const BookItem = ({ book, isPurchased, user }: BookProps) => {
  const router = useRouter();

  const handleBookClick = () => {
    // 無料記事の場合は、ログインチェックをスキップして直接記事ページへ
    if (!book.price || book.price === 0) {
      router.push(`/book/${book.id}`);
      return;
    }

    // 有料記事の場合は、ログインチェック
    if (!user) {
      router.push("/api/auth/signin");
      return;
    }

    // 購入済みの記事は記事ページへ
    if (isPurchased) {
      router.push(`/book/${book.id}`);
    } else {
      // 有料記事で未購入の場合は決済処理を開始
      startCheckout();
    }
  };

  // 決済処理の関数
  const startCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: book.title,
          price: book.price,
          bookId: book.id,
          userId: user?.id,
          description: book.description,
        }),
      });

      const responseData = await response.json();

      if (responseData.checkout_url) {
        window.location.href = responseData.checkout_url;
      }
    } catch (error) {
      console.error("Error in startCheckout:", error);
    }
  };

  console.log("Book price:", book.price);
  console.log("Is purchased:", isPurchased);
  console.log("User:", user);

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
