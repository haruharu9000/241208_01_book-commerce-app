import { getBooksBySpecificMonth } from "@/app/lib/microcms/client";
import BookItem from "@/app/components/BookItem";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase } from "@/app/types/types";
import { Metadata } from "next";

interface Props {
  params: { date: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedDate = decodeURIComponent(params.date);

  return {
    title: `${decodedDate}の記事`,
    description: `${decodedDate}に投稿された技術記事の一覧です。この時期の開発ノウハウや技術トレンドをご覧いただけます。`,
    openGraph: {
      title: `${decodedDate}の記事 | sandbox:/`,
      description: `${decodedDate}に投稿された技術記事の一覧です。`,
    },
  };
}

export default async function ArchivePage({ params }: Props) {
  // URLデコードを行う
  const decodedDate = decodeURIComponent(params.date);
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;
  const books = await getBooksBySpecificMonth(decodedDate);

  let purchaseBookIds: string[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      const purchasesData = await response.json();
      purchaseBookIds = purchasesData.map(
        (purchaseBook: Purchase) => purchaseBook.bookId
      );
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-elegant-lightText dark:text-elegant-darkText">
        アーカイブ: {decodedDate}
      </h1>
      {books.length > 0 ? (
        <div className="space-y-6">
          {books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              isPurchased={purchaseBookIds.includes(book.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-elegant-lightMuted dark:text-elegant-darkMuted">
          この月の記事はありません。
        </p>
      )}
    </div>
  );
}
