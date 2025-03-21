import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types";
import { Suspense } from "react";

const CheckoutPage = async ({
  searchParams,
}: {
  searchParams: {
    bookId: string;
    userId: string;
    title: string;
    price: string;
    description: string;
  };
}) => {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  if (!user) {
    redirect("/api/auth/signin");
  }

  try {
    const response = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/checkout"
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: searchParams.bookId,
          userId: searchParams.userId,
          title: searchParams.title,
          price: parseInt(searchParams.price),
          description: searchParams.description,
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

    // クライアントサイドでリダイレクトを行うためのHTML返却
    return (
      <Suspense fallback={<div>決済ページに移動中...</div>}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">決済ページに移動中...</h1>
            <p className="mb-4">自動的に決済ページに移動します。</p>
            <p className="text-sm text-gray-500">
              移動しない場合は
              <a
                href={data.checkout_url}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                こちら
              </a>
              をクリックしてください。
            </p>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.href = "${data.checkout_url}";`,
            }}
          />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            エラーが発生しました
          </h1>
          <p className="mb-4">
            決済処理中にエラーが発生しました。もう一度お試しください。
          </p>
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            トップページに戻る
          </a>
        </div>
      </div>
    );
  }
};

export default CheckoutPage;
