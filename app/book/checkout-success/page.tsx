"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // クエリパラメータから`session_id`を取得
    const sessionIdParam = searchParams.get("session_id");
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/checkout/success`,
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

        if (!data || !data.purchase.bookId) {
          console.error("Invalid data structure:", data);
          return;
        }

        setBookId(data.purchase.bookId);
      } catch (err) {
        console.error("Error in fetchData:", err);
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
        {bookId && (
          <div className="mt-6">
            <Link href={`/book/${bookId}`} className="text-indigo-600">
              購入した本を見る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseSuccess;
