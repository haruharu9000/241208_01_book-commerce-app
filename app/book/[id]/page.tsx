import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { Purchase } from "@/app/types/types";
import { cookies } from "next/headers";

const DetailBook = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { from?: string };
}) => {
  try {
    if (!params.id || typeof params.id !== "string") {
      return notFound();
    }

    const session = await getServerSession(nextAuthOptions);
    const book = await getDetailBook(params.id).catch(() => null);

    if (!book || typeof book !== "object") {
      return notFound();
    }

    // 有料記事の場合のアクセス制御
    if (book.price > 0) {
      // 未ログインの場合、ログインページにリダイレクト
      if (!session?.user?.id) {
        const callbackUrl = encodeURIComponent(`/book/${params.id}`);
        return redirect(`/api/auth/signin?callbackUrl=${callbackUrl}`);
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      // 購入状態を確認
      const purchaseResponse = await fetch(
        `${baseUrl}/api/purchases/${session.user.id}`,
        {
          headers: {
            Cookie: cookies().toString(),
          },
          cache: "no-store",
          credentials: "include",
        }
      );

      if (!purchaseResponse.ok) {
        throw new Error("購入履歴の取得に失敗しました");
      }

      const purchases = await purchaseResponse.json();
      const isPurchased = purchases.some(
        (purchase: Purchase) => purchase.bookId === params.id
      );

      // チェックアウトからの遷移でない場合は購入状態に応じて処理
      if (!searchParams?.from) {
        if (!isPurchased) {
          // 未購入の場合、決済処理を開始
          const checkoutResponse = await fetch(`${baseUrl}/api/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: cookies().toString(),
            },
            credentials: "include",
            body: JSON.stringify({
              bookId: book.id,
              userId: session.user.id,
              title: book.title,
              price: book.price,
              description: book.description || "",
            }),
          });

          if (!checkoutResponse.ok) {
            throw new Error("決済処理の開始に失敗しました");
          }

          const data = await checkoutResponse.json();
          if (data.checkout_url) {
            return redirect(data.checkout_url);
          }
          throw new Error("決済URLの取得に失敗しました");
        }
      } else if (!isPurchased) {
        throw new Error("記事の購入が確認できません");
      }
    }

    // 無料記事または購入済み記事の表示
    return (
      <div className="px-6 lg:px-12 py-4 sm:py-6 bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300">
        <div className="bg-white dark:bg-elegant-darkCard shadow-lg rounded-xl overflow-hidden transition-colors duration-300">
          {book.thumbnail?.url && (
            <Image
              src={book.thumbnail.url}
              alt={book.title || "無題"}
              className="w-full h-64 sm:h-80 object-cover object-center"
              width={700}
              height={400}
              priority
            />
          )}
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-elegant-lightText dark:text-elegant-darkText">
              {book.title || "無題"}
            </h1>
            <div
              className="prose max-w-none text-sm sm:text-base leading-relaxed dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: book.content || "" }}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 text-sm text-elegant-lightMuted dark:text-elegant-darkMuted gap-2">
          <span>
            公開日: {new Date(book.createdAt).toLocaleDateString("ja-JP")}
          </span>
          <span>
            最終更新: {new Date(book.updatedAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </div>
    );
  } catch (error) {
    console.error("DetailBook error:", error);
    if ((error as Error).message.includes("NEXT_REDIRECT")) {
      throw error; // リダイレクトエラーは再スロー
    }
    throw new Error("記事の表示中にエラーが発生しました");
  }
};

export default DetailBook;
