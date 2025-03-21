import { getAllBooks } from "@/app/lib/microcms/client";
import BookItem from "@/app/components/BookItem";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase, BookType } from "@/app/types/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;
  const { contents } = await getAllBooks();
  const query = decodeURIComponent(searchParams.q || "");

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

  // 検索ロジック
  const searchResults = contents.filter((book: BookType) => {
    const searchText =
      `${book.title} ${book.description} ${book.content}`.toLowerCase();
    const searchQuery = query.toLowerCase();

    // 検索クエリを空白で分割して、各キーワードで検索
    const keywords = searchQuery
      .split(/\s+/)
      .filter((keyword) => keyword.length > 0);
    return keywords.every((keyword) => searchText.includes(keyword));
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        検索結果: {query ? `"${query}"` : "検索キーワードを入力してください"}
      </h1>
      {searchResults.length > 0 ? (
        <div className="space-y-6">
          {searchResults.map((book: BookType) => (
            <BookItem
              key={book.id}
              book={book}
              isPurchased={purchaseBookIds.includes(book.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">検索結果が見つかりませんでした。</p>
      )}
    </div>
  );
}
