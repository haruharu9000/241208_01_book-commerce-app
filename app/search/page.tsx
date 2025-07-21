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
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-elegant-lightText dark:text-elegant-darkText">
        検索結果: &ldquo;{searchQuery}&rdquo;
      </h1>
      <SearchResults books={data.contents || []} searchQuery={searchQuery} />
    </div>
  );
}
