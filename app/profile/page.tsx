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
        {/* プロフィールセクション */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "ユーザー"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {session.user.name || "名前未設定"}
              </h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* 購入済み記事セクション */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-6">購入済み記事一覧</h3>
          <div className="grid gap-6">
            {purchases.length > 0 ? (
              purchases.map((purchase) => (
                <Link
                  key={purchase.id}
                  href={`/book/${purchase.bookId}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
                >
                  <div className="flex items-center p-4">
                    {purchase.book?.thumbnail ? (
                      <div className="w-48 h-48 relative flex-shrink-0">
                        <Image
                          src={purchase.book.thumbnail.url}
                          alt={purchase.book.title}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 rounded-md flex-shrink-0" />
                    )}
                    <div className="ml-6 flex-grow">
                      <h2 className="text-xl font-semibold mb-2 text-gray-900">
                        {purchase.book?.title || "タイトルなし"}
                      </h2>
                      <p className="text-sm text-gray-600">
                        購入日:{" "}
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "ja-JP"
                        )}
                      </p>
                    </div>
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
