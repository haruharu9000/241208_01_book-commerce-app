"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      try {
        console.log("Fetching purchase data with session ID:", sessionId);
        const res = await fetch("/api/checkout/success", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 認証情報を含める
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          throw new Error(`購入データの取得に失敗しました (${res.status})`);
        }

        const data = await res.json();
        console.log("Response data:", data);

        if (!data || !data.purchase.bookId) {
          throw new Error("購入データが正しくありません");
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