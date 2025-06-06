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
    <div className="flex items-center justify-center mt-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          購入ありがとうございます！
        </h1>
        <p className="text-lg text-gray-600">
          購入手続きが正常に完了しました。
        </p>
        {error ? (
          <p className="text-red-600 mt-4">{error}</p>
        ) : bookId ? (
          <div className="mt-6">
            <Link href={`/book/${bookId}`} className="text-indigo-600">
              購入した本を見る
            </Link>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">購入データを取得中...</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseSuccess;
