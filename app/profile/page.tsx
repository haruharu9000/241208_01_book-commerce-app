import Image from "next/image";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { BookType, Purchase, User } from "../types/types";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);

  // セッションがない場合、未ログイン状態として処理
  if (!session || !session.user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">プロフィール</h1>
        <p>ログインしてください。</p>
      </div>
    );
  }

  const user = session.user as User;
  let purchasesDetailBooks: BookType[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" } // SSR
    );

    if (!response.ok) {
      throw new Error("購入履歴の取得に失敗しました");
    }

    const purchasesData = await response.json();

    purchasesDetailBooks = await Promise.all(
      purchasesData.map(async (purchase: Purchase) => {
        return await getDetailBook(purchase.bookId);
      })
    );
  } catch (error) {
    console.error("Error fetching purchases:", error);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"} // 画像がなければデフォルトアイコンを表示
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h2 className="text-lg ml-4 font-semibold">
            ユーザー名：{user.name || "ゲスト"}
          </h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex flex-wrap justify-start gap-4">
        {purchasesDetailBooks.length > 0 ? (
          purchasesDetailBooks.map((purchaseDetailBook: BookType) => (
            <PurchaseDetailBook
              key={purchaseDetailBook.id}
              purchaseDetailBook={purchaseDetailBook}
            />
          ))
        ) : (
          <p>購入した記事はありません。</p>
        )}
      </div>
    </div>
  );
}
