import Image from "next/image";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import PurchaseDetailBook from "../components/PurchaseDetailBook";
import { BookType, Purchase } from "../types/types";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return (
      <div className="text-center py-20">
        <p>ログインが必要です</p>
      </div>
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/purchases/${session.user.id}`,
    { cache: "no-store" }
  );

  const purchases: (Purchase & { book: BookType })[] = await response.json();

  return (
    <div className="px-6 lg:px-12 py-4 sm:py-6 bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300">
      {/* プロフィールセクション */}
      <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 w-full transition-colors duration-300">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt={session.user.name || "ユーザー"}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-elegant-lightText dark:text-elegant-darkText">
              {session.user.name || "名前未設定"}
            </h2>
            <p className="text-sm sm:text-base text-elegant-lightMuted dark:text-elegant-darkMuted">
              {session.user.email}
            </p>
          </div>
        </div>
      </div>

      {/* 購入済み記事セクション */}
      <div className="bg-white dark:bg-elegant-darkCard rounded-lg shadow-sm p-6 w-full transition-colors duration-300">
        <h3 className="text-xl font-bold mb-6 text-elegant-lightText dark:text-elegant-darkText">
          購入済み記事一覧
        </h3>
        <div className="space-y-4">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <Link
                key={purchase.id}
                href={`/book/${purchase.bookId}`}
                className="block bg-white dark:bg-elegant-darkCard rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-elegant-highlight dark:border-elegant-primary"
              >
                <div className="flex items-center">
                  {purchase.book?.thumbnail ? (
                    <div className="w-40 h-40 relative flex-shrink-0">
                      <Image
                        src={purchase.book.thumbnail.url}
                        alt={purchase.book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-32 bg-elegant-highlight dark:bg-elegant-primary flex-shrink-0" />
                  )}
                  <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold mb-2 text-elegant-lightText dark:text-elegant-darkText">
                      {purchase.book?.title || "タイトルなし"}
                    </h2>
                    <p className="text-sm text-elegant-lightMuted dark:text-elegant-darkMuted">
                      購入日:{" "}
                      {new Date(purchase.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-elegant-lightMuted dark:text-elegant-darkMuted py-8">
              購入済みの記事はありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
