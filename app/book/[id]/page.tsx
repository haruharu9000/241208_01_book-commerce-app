import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase } from "@/app/types/types";
import Link from "next/link";
import { cookies } from "next/headers";

// 日付フォーマット関数を最適化（エラーハンドリングを簡素化）
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "日付なし";
  return new Date(dateString).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
};

const DetailBook = async ({ params }: { params: { id: string } }) => {
  // 早期リターンで無効なIDをチェック
  if (!params.id || typeof params.id !== "string") {
    return notFound();
  }

  // 並行してセッションと書籍データを取得
  const [session, book] = await Promise.all([
    getServerSession(nextAuthOptions),
    getDetailBook(params.id).catch(() => null),
  ]);

  // 書籍データの存在チェックを早期に実行
  if (!book || typeof book !== "object") {
    return notFound();
  }

  const user = session?.user as User | undefined;

  // 購入状態確認を最適化
  const checkPurchaseStatus = async (
    userId: string,
    bookId: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${userId}`,
        {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) return false;
      const purchases = await response.json();
      return purchases.some((purchase: Purchase) => purchase.bookId === bookId);
    } catch {
      return false;
    }
  };

  // 有料記事の処理を最適化
  if (book.price > 0) {
    // 未ログインユーザーの処理
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
                priority // 重要な画像は優先的に読み込み
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

    // 購入状態を確認
    const isPurchased = await checkPurchaseStatus(user.id, params.id);
    if (!isPurchased) {
      // 必須パラメータの存在確認を簡素化
      if (!book.id || !user.id || !book.title) {
        throw new Error("必要な情報が不足しています");
      }

      try {
        // APIエンドポイントのURL構築を最適化
        const apiUrl = `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_BASE_URL}/api/checkout`;

        // Stripe決済処理
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

        if (!response.ok) {
          throw new Error(
            `決済処理中にエラーが発生しました: ${response.statusText}`
          );
        }

        const { checkout_url } = await response.json();
        if (!checkout_url) {
          throw new Error("決済URLが見つかりませんでした");
        }

        // リダイレクト処理を最適化
        return (
          <html>
            <head>
              <meta httpEquiv="refresh" content={`0;url=${checkout_url}`} />
            </head>
            <body>
              <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
              </div>
            </body>
          </html>
        );
      } catch {
        throw new Error("決済処理に失敗しました。もう一度お試しください。");
      }
    }
  }

  // 記事表示の最適化
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
            priority
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
};

export default DetailBook;
