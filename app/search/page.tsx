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
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8 text-center">
        検索結果: &ldquo;{searchQuery}&rdquo;
      </h1>
      <SearchResults books={data.contents || []} searchQuery={searchQuery} />
    </div>
  );
}
