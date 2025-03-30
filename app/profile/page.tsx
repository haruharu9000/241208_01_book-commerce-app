import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { redirect } from "next/navigation";
import { Purchase } from "@/app/types/types";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user) {
    redirect("/login");
  }

  try {
    // 購入済み記事を取得
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const purchasesResponse = await fetch(
      `${baseUrl}/api/purchases/${session.user.id}`,
      { cache: "no-store" }
    );

    if (!purchasesResponse.ok) {
      throw new Error("購入履歴の取得に失敗しました");
    }

    const purchases: Purchase[] = await purchasesResponse.json();

    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-8 text-center">
          購入済み記事一覧
        </h1>
        <div className="space-y-6">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <Link
                key={purchase.id}
                href={`/book/${purchase.bookId}`}
                className="flex bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
              >
                {purchase.book?.thumbnail ? (
                  <div className="w-40 h-40 relative flex-shrink-0">
                    <Image
                      src={purchase.book.thumbnail.url}
                      alt={purchase.book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-gray-200 flex-shrink-0" />
                )}
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    {purchase.book?.title || "タイトルなし"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    購入日:{" "}
                    {new Date(purchase.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 py-8">
              購入済みの記事はありません
            </p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Profile page error:", error);
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 text-center">エラー</h1>
        <p className="text-red-600 text-center">
          データの取得中にエラーが発生しました
        </p>
      </div>
    );
  }
}
