import { getBooksByCategory } from "@/app/lib/microcms/client";
import BookItem from "@/app/components/BookItem";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User, Purchase, BookType } from "@/app/types/types";

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { contents } = (await getBooksByCategory(params.id)) as {
    contents: BookType[];
  };
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">カテゴリー: {params.id}</h1>
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
  );
}
