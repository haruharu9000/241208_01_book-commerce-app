import Image from "next/image";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
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
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* プロフィールセクション */}
      <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-lg p-4 sm:p-6 md:p-8 transition-colors duration-300">
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt={session.user.name || "ユーザー"}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-elegant-lightText dark:text-elegant-darkText md:mb-1">
              {session.user.name || "名前未設定"}
            </h2>
            <p className="text-base sm:text-lg text-elegant-lightMuted dark:text-elegant-darkMuted">
              Next.jsとMicroCMS
              <br />
              でブログ構築中です
            </p>
          </div>
        </div>
      </div>

      {/* 購入済み記事セクション */}
      <div className="bg-white dark:bg-elegant-darkCard rounded-xl shadow-lg p-4 sm:p-6 md:p-8 transition-colors duration-300">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-elegant-lightText dark:text-elegant-darkText">
          購入済み記事一覧
        </h3>
        <div className="space-y-4 sm:space-y-6">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <Link
                key={purchase.id}
                href={`/book/${purchase.bookId}`}
                className="block bg-white dark:bg-elegant-darkCard rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-elegant-highlight dark:border-elegant-primary purchase-card"
              >
                <div className="flex flex-col md:flex-row">
                  {purchase.book?.thumbnail ? (
                    <div className="w-full md:w-1/3 md:min-w-[200px] h-48 md:h-auto relative flex-shrink-0">
                      <Image
                        src={purchase.book.thumbnail.url}
                        alt={purchase.book.title}
                        fill
                        className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full md:w-1/3 md:min-w-[200px] h-48 md:h-auto bg-elegant-highlight dark:bg-elegant-primary flex-shrink-0 rounded-t-xl md:rounded-l-xl md:rounded-t-none" />
                  )}
                  <div className="flex-grow min-w-0 p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-elegant-lightText dark:text-elegant-darkText leading-tight break-words line-clamp-2">
                      {purchase.book?.title || "タイトルなし"}
                    </h2>
                    <div className="text-sm md:text-base text-elegant-lightMuted dark:text-elegant-darkMuted line-clamp-3 leading-relaxed break-words overflow-hidden mb-3 md:mb-4 purchase-content">
                      {purchase.book?.content
                        ?.replace(/<[^>]*>/g, "")
                        .substring(0, 150)}
                      ...
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs md:text-sm text-elegant-lightMuted dark:text-elegant-darkMuted">
                        購入日:{" "}
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "ja-JP"
                        )}
                      </span>
                      <span className="inline-block bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                        購入済み
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-elegant-lightMuted dark:text-elegant-darkMuted py-8 text-sm sm:text-base">
              購入済みの記事はありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
