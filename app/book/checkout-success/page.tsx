//"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// eslint-disable-next-line @next/next/no-async-client-component
const PurchaseSuccess = () => {
  const [bookUrl, setBookUrl] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  //console.log(sessionId);
  useEffect(() => {
    const fetchData = async () => {
    console.log("Debug - API request body:", { sessionId }); // リクエスト送信前の確認
      if (sessionId) {
      console.log("Debug - sessionId is missing:", sessionId); // sessionId がない場合
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/checkout/success`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );
          //console.log(await res.json());
          const data = await response.json();
          console.log("API response data:", data);

          if (!data || !data.purchase || !data.purchase.bookId) {
            console.error("Invalid data structure:", data);
            return;
          }
          setBookUrl(data.purchase.bookId);
        } catch (err) {
          console.error("Error in fetchData:", err); // エラー内容をログ出力
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          購入ありがとうございます！
        </h1>
        <p className="text-center text-gray-600">
          ご購入いただいた内容の詳細は、登録されたメールアドレスに送信されます。
        </p>
        <div className="mt-6 text-center">
          <Link href="/book/[id]" as={`/book/${bookUrl}`} className="text-indigo-600">
              購入した記事を読む
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;