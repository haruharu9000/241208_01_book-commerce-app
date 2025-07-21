"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [bookId, setBookId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    console.log("Debug: Retrieved session_id from URL:", sessionIdParam);

    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      if (!sessionId) return;

      try {
        console.log(
          "Debug: Fetching purchase data with session ID:",
          sessionId
        );

        const res = await fetch(
          `/api/checkout/success?session_id=${sessionId}`
        );

        console.log("Debug: API response status:", res.status);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(
              "購入データが見つかりませんでした（404 Not Found）"
            );
          } else if (res.status === 400) {
            throw new Error("セッションIDが不足しています（400 Bad Request）");
          } else {
            throw new Error(
              `購入データの取得に失敗しました（エラーコード: ${res.status}）`
            );
          }
        }

        const data = await res.json();
        console.log("Debug: Response data from API:", data);

        if (!data || !data.purchase?.bookId) {
          throw new Error("購入データが正しくありません（データ不整合）");
        }

        setBookId(data.purchase.bookId);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました"
        );
      }
    };

    fetchData();
  }, [sessionId]);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-elegant-lightText dark:text-elegant-darkText">
        購入完了
      </h1>

      <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-lg p-4 sm:p-6 md:p-8 transition-colors duration-300 max-w-none">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mt-8 sm:mt-10 mb-8 sm:mb-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-elegant-lightText dark:text-elegant-darkText mb-10 sm:mb-12">
            購入ありがとうございます！
          </h2>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-400 text-sm sm:text-base">
                {error}
              </p>
            </div>
          ) : bookId ? (
            <div className="space-y-6">
              <Link
                href={`/book/${bookId}`}
                className="inline-block bg-elegant-primary dark:bg-elegant-darkBlueHover text-elegant-lightBg dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-elegant-warmAccent dark:hover:bg-elegant-warmAccent transition-colors duration-200"
              >
                購入した記事を見る
              </Link>
              <div>
                <Link
                  href="/"
                  className="inline-block text-elegant-lightMuted dark:text-elegant-darkMuted hover:text-elegant-lightText dark:hover:text-elegant-darkText transition-colors duration-200 text-sm sm:text-base"
                >
                  ← ホームに戻る
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-elegant-lightMuted dark:border-elegant-darkMuted"></div>
              <p className="text-elegant-lightMuted dark:text-elegant-darkMuted text-sm sm:text-base">
                購入データを取得中...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
