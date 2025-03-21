import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase } from "@/app/types/types";
import Link from "next/link";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "日付なし";
  try {
    return new Date(dateString).toLocaleDateString("ja-JP");
  } catch (error) {
    console.error("Date formatting error:", error);
    return "日付なし";
  }
};

const DetailBook = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;
  const id = params.id;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  try {
    const book = await getDetailBook(id);
    if (!book || typeof book !== "object") {
      throw new Error("Invalid book data received");
    }

    // 購入状態を確認
    let isPurchased = false;
    if (user) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Purchase check failed: ${response.statusText}`);
          isPurchased = false;
        } else {
          const purchases = await response.json();
          isPurchased = purchases.some(
            (purchase: Purchase) => purchase.bookId === id
          );
        }
      } catch (error) {
        console.error("Error checking purchase status:", error);
        isPurchased = false;
      }
    }

    // 有料記事で未購入の場合の処理
    if (book.price > 0 && !isPurchased) {
      if (!user) {
        redirect("/api/auth/signin");
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: book.title || "無題",
              price: book.price || 0,
              bookId: book.id,
              userId: user.id,
              description: book.description || "",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Checkout failed: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.checkout_url) {
          throw new Error("Checkout URL not found in response");
        }

        redirect(data.checkout_url);
      } catch (error) {
        console.error("Checkout error:", error);
        throw new Error(
          "決済処理中にエラーが発生しました。もう一度お試しください。"
        );
      }
    }

    // 無料記事または購入済みの場合は全文表示
    const shouldShowFullContent = book.price === 0 || isPurchased;

    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {book.thumbnail?.url && (
            <Image
              src={book.thumbnail.url}
              alt={book.title || "無題"}
              className="w-full h-80 object-cover object-center"
              width={700}
              height={400}
            />
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{book.title || "無題"}</h1>
            {book.price === 0 ? (
              // 無料記事の場合
              <div>
                <p className="text-gray-600 mb-4">
                  {book.description || "説明なし"}
                </p>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: book.content || "" }}
                />
              </div>
            ) : shouldShowFullContent ? (
              // 有料記事で購入済みの場合
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: book.content || "" }}
              />
            ) : (
              // 有料記事で未購入の場合
              <div className="space-y-4">
                <p className="text-gray-600">
                  {book.description || "説明なし"}
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-lg font-semibold mb-2">
                    この記事は有料コンテンツです
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ¥{(book.price || 0).toLocaleString()}
                  </p>
                  {user ? (
                    <form
                      action={`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`}
                      method="POST"
                    >
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
            公開日: {formatDate(book.createdAt)}
          </span>
          <span className="text-sm text-gray-500">
            最終更新: {formatDate(book.updatedAt)}
          </span>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("Book not found")) {
      return notFound();
    }
    console.error("Error in DetailBook:", error);
    throw new Error(
      "記事の取得中にエラーが発生しました。もう一度お試しください。"
    );
  }
};

export default DetailBook;
