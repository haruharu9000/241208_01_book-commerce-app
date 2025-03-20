import BookItem from "./components/BookItem";
import Sidebar from "./components/Sidebar";
import { BookType, Purchase, User } from "./types/types";
import { getAllBooks, getBooksByMonth } from "./lib/microcms/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./lib/next-auth/options";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const { contents } = await getAllBooks();
  const { groupedBooks, sortedMonths } = await getBooksByMonth();
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
          <div className="space-y-6">
            {contents.map((book: BookType) => (
              <BookItem
                key={book.id}
                book={book}
                isPurchased={purchaseBookIds.includes(book.id)}
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-1">
          <Sidebar
            groupedBooks={groupedBooks}
            sortedMonths={sortedMonths}
            contents={contents}
          />
        </div>
      </div>
    </div>
  );
}
