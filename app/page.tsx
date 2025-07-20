import BookItem from "./components/BookItem";
import { BookType, Purchase, User } from "./types/types";
import { getAllBooks } from "./lib/microcms/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const { contents } = await getAllBooks();
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchaseBookIds: string[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" } // SSR
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
    <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-6">
      <div className="space-y-3 sm:space-y-6">
        <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6 text-gray-900">
          記事一覧
        </h1>
        <div className="space-y-3 sm:space-y-6">
          {contents.map((book: BookType) => (
            <BookItem
              key={book.id}
              book={book}
              isPurchased={purchaseBookIds.includes(book.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
