import { getBooksByCategory } from "@/app/lib/microcms/client";
import BookItem from "@/app/components/BookItem";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase, BookType } from "@/app/types/types";
import { Metadata } from "next";

// カテゴリー表示名マッピング（必要に応じて増やせる）
const categoryDisplayNames: { [key: string]: string } = {
  worksummary: "日報",
  programming: "プログラミング",
  // 例: design: "デザイン",
};

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = categoryDisplayNames[params.id] || params.id;

  return {
    title: `${categoryName}カテゴリ`,
    description: `${categoryName}に関する技術記事一覧です。専門的な知識やノウハウを学べる記事を集めました。`,
    openGraph: {
      title: `${categoryName}カテゴリ | sandbox:/`,
      description: `${categoryName}に関する技術記事一覧です。`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  // 並列でデータを取得してパフォーマンスを向上
  const [booksData, session] = await Promise.all([
    getBooksByCategory(params.id),
    getServerSession(nextAuthOptions),
  ]);

  const { contents } = booksData;
  const user = session?.user as User;

  let purchaseBookIds: string[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      {
        cache: "force-cache",
        next: { revalidate: 300 },
      }
    );

    if (response.ok) {
      const purchasesData = await response.json();
      purchaseBookIds = purchasesData.map(
        (purchaseBook: Purchase) => purchaseBook.bookId
      );
    }
  }

  // マッピングに基づく日本語名表示（fallbackあり）
  const categoryDisplayName = categoryDisplayNames[params.id] || params.id;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-elegant-lightText dark:text-elegant-darkText">
        カテゴリー: {categoryDisplayName}
      </h1>
      <div className="space-y-4 sm:space-y-6">
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
