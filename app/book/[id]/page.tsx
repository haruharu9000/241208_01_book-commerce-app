import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase } from "@/app/types/types";
import Link from "next/link";

const DetailBook = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;
  const id = params.id;

  // IDが無効な場合の処理
  if (!id || id === "null") {
    console.error("Invalid ID:", id);
    return notFound();
  }

  try {
    // 本のデータを取得
    const book = await getDetailBook(id);

    // データが存在しない場合の処理
    if (!book) {
      console.error("Book not found for ID:", id);
      return notFound();
    }

    // 購入状態を確認
    let isPurchased = false;
    if (user) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
        { cache: "no-store" }
      );
      if (response.ok) {
        const purchases = await response.json();
        isPurchased = purchases.some(
          (purchase: Purchase) => purchase.bookId === id
        );
      }
    }

    // 無料記事または購入済みの場合は全文表示
    const shouldShowFullContent = book.price === 0 || isPurchased;

    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {book.thumbnail && (
            <Image
              src={book.thumbnail.url}
              alt={book.title}
              className="w-full h-80 object-cover object-center"
              width={700}
              height={400}
            />
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            {shouldShowFullContent ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: book.content }}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">{book.description}</p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-lg font-semibold mb-2">
                    この記事は有料コンテンツです
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ¥{book.price.toLocaleString()}
                  </p>
                  {user ? (
                    <form action="/api/checkout" method="POST">
                      <input type="hidden" name="bookId" value={book.id} />
                      <input type="hidden" name="userId" value={user.id} />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        購入して続きを読む
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/api/auth/signin"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      ログインして購入
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            公開日: {new Date(book.createdAt).toLocaleDateString("ja-JP")}
          </span>
          <span className="text-sm text-gray-500">
            最終更新: {new Date(book.updatedAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </div>
    );
  } catch (error) {
    // APIエラーのハンドリング
    console.error("Error fetching book data:", error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">エラーが発生しました</h2>
          <p>
            データの取得中に問題が発生しました。しばらくしてからもう一度お試しください。
          </p>
        </div>
      </div>
    );
  }
};

export default DetailBook;
