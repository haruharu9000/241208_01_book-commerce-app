import { getBooksBySpecificMonth } from "@/app/lib/microcms/client";
import BookItem from "@/app/components/BookItem";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase } from "@/app/types/types";

export default async function ArchivePage({
  params,
}: {
  params: { date: string };
}) {
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
    <div className="max-w-4xl mx-auto px-4 py-6 bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300">
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
