"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
  user: User;
};

const Book = ({ book, isPurchased, user }: BookProps) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

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

  const handlePurchaseClick = () => {
    if (isPurchased) {
      alert("その商品は購入済みです。");
    } else {
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePurchaseConfirm = () => {
    if (!user) {
      setShowModal(false);
      // ログインページへリダイレクト
      router.push("/api/auth/signin");
    } else {
      // Stripeで決済
      startCheckout();
    }
  };

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center p-2 md:p-4">
        <a
          onClick={handlePurchaseClick}
          className="cursor-pointer shadow-xl rounded-xl overflow-hidden duration-300 hover:translate-y-1 hover:shadow-2xl max-w-xs md:max-w-sm w-full"
        >
          <Image
            priority
            src={book.thumbnail?.url ?? ""}
            alt={book.title}
            width={450}
            height={350}
            className="w-full h-auto"
          />
          <div className="px-4 py-4 md:px-6 md:py-6 bg-slate-100">
            <h2 className="text-base md:text-lg font-semibold mb-2 leading-tight">
              {book.title}
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-3 leading-relaxed">
              {book.description}
            </p>
            <p className="text-sm md:text-base text-slate-700 font-medium">
              価格: {book.price}円
            </p>
          </div>
        </a>

        {showModal && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal p-4">
            <div className="bg-white p-6 md:p-8 rounded-xl max-w-sm w-full mx-4">
              <h3 className="text-lg md:text-xl mb-4 font-semibold">
                本を購入しますか？
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePurchaseConfirm}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  購入する
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Book;
