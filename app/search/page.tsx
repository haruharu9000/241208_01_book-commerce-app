import { getListBooks } from "@/app/lib/microcms/client";
import SearchResults from "@/app/components/SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const searchQuery = searchParams.q || "";
  const data = await getListBooks({
    queries: {
      q: searchQuery,
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-w-5xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-gray-900">
        検索結果: &ldquo;{searchQuery}&rdquo;
      </h1>
      <SearchResults books={data.contents || []} searchQuery={searchQuery} />
    </div>
  );
}
