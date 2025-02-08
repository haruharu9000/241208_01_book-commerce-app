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
        const res = await fetch("/api/checkout/success", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          throw new Error(`購入データの取得に失敗しました (${res.status})`);
        }

        const data = await res.json();
        console.log("Response data:", data);

        if (!data || !data.purchase?.bookId) {
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
        <h1>購入ありがとうございます！</h1>
        {error ? (
          <p>{error}</p>
        ) : (
          bookId && <Link href={`/book/${bookId}`}>購入した本を見る</Link>
        )}
      </div>
    </div>
  );
};

export default PurchaseSuccess;
