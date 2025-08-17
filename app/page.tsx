import BookItem from "./components/BookItem";
import { BookType, Purchase, User } from "./types/types";
import { getAllBooks } from "./lib/microcms/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ホーム",
  description:
    "最新のプログラミング技術記事や開発ノウハウを掲載しています。Next.js、React、TypeScriptなどのWeb開発に役立つ情報をお届けします。",
  openGraph: {
    title: "ホーム | sandbox:/",
    description:
      "テクノロジーから日々の気づき、観察・探究・構築物まで。ジャンルには依らず、思考と技術と日常のあいだを行き来しながら、そのプロセスを綴っています。",
  },
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  // 並列でデータを取得してパフォーマンスを向上
  const [booksData, session] = await Promise.all([
    getAllBooks(),
    getServerSession(nextAuthOptions),
  ]);

  const { contents } = booksData;
  const user = session?.user as User;

  let purchaseBookIds: string[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      {
        cache: "force-cache", // キャッシュを有効化（5分間有効）
        next: { revalidate: 300 },
      }
    );

    if (response.ok) {
      const purchasesData = await response.json();
      purchaseBookIds = purchasesData.map(
        (purchaseBook: Purchase) => purchaseBook.bookId
      );
    } else {
      console.error("Failed to fetch purchases:", response.status);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-elegant-lightText dark:text-elegant-darkText">
        記事一覧
      </h1>
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {contents.map((book: BookType) => (
          <BookItem
            key={book.id}
            book={book}
            isPurchased={purchaseBookIds.includes(book.id)}
          />
        ))}
      </div>
    </div>
  );
}
