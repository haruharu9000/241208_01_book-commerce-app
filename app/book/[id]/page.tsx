import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase } from "@/app/types/types";
import Link from "next/link";
import { cookies } from "next/headers";

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
              <div className="p-6 text-center">
                <h1 className="text-3xl font-bold mb-4">
                  {book.title || "無題"}
                </h1>
                <p className="text-gray-600 mb-4">
                  {book.description || "説明なし"}
                </p>
                <Link
                  href="/api/auth/signin"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ログインして購入
                </Link>
              </div>
            </div>
          </div>
        );
      }

      // 必須パラメータの存在確認
      if (!book.id || !user.id || !book.title) {
        console.error("Missing required params:", {
          bookId: book.id,
          userId: user.id,
          title: book.title,
        });
        throw new Error("必要な情報が不足しています");
      }

      try {
        console.log("Starting checkout process...");
        console.log("Request params:", {
          bookId: book.id,
          userId: user.id,
          title: book.title,
          price: book.price,
        });

        // APIエンドポイントのURL構築
        const apiUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/api/checkout"
            : `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout`;

        console.log("API URL:", apiUrl);

        // Stripe決済を直接開始
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            bookId: book.id,
            userId: user.id,
            title: book.title,
            price: book.price,
            description: book.description || "",
          }),
        });

        console.log("Checkout response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Checkout error response:", errorText);
          throw new Error(
            `決済処理中にエラーが発生しました: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Checkout response data:", data);

        if (!data.checkout_url) {
          console.error("No checkout URL in response:", data);
          throw new Error("決済URLが見つかりませんでした");
        }

        console.log("Redirecting to:", data.checkout_url);
        // クライアントサイドでリダイレクトするためのJSXを返す
        return (
          <html>
            <head>
              <meta
                httpEquiv="refresh"
                content={`0;url=${data.checkout_url}`}
              />
            </head>
            <body>
              <p>決済ページに移動しています...</p>
            </body>
          </html>
        );
      } catch (error) {
        console.error("Checkout process error:", error);
        throw new Error(
          "決済処理中にエラーが発生しました。詳細はログを確認してください。"
        );
      }
    }

    // 無料記事または購入済みの場合は全文表示
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
            <div>
              <p className="text-gray-600 mb-4">
                {book.description || "説明なし"}
              </p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: book.content || "" }}
              />
            </div>
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
