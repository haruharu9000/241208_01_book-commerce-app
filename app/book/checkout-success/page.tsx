"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // クエリパラメータから `session_id` を取得
    const sessionIdParam = searchParams.get("session_id");
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/success`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const data = await res.json();
        console.log("Response data:", data);

        if (!res.ok || !data.purchase?.bookId) {
          throw new Error("購入データの取得に失敗しました。");
        }

        setBookId(data.purchase.bookId);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("購入情報を取得できませんでした。");
      } finally {
        setLoading(false);
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

        {loading && <p className="text-gray-500 mt-4">購入情報を取得中...</p>}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {!loading && !error && bookId && (
          <div className="mt-6">
            <Link
              href={`/book/${bookId}`}
              className="text-indigo-600 hover:underline"
            >
              購入した本を見る
            </Link>
          </div>
        )}

        {!loading && !error && !bookId && (
          <p className="text-gray-500 mt-4">
            購入した本の情報が見つかりませんでした。
          </p>
        )}
      </div>
    </div>
  );
};

export default PurchaseSuccess;