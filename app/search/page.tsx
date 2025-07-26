import { getListBooks } from "@/app/lib/microcms/client";
import SearchResults from "@/app/components/SearchResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事検索",
  description:
    "技術記事やプログラミング関連の記事を検索できます。キーワードを入力して興味のある記事を見つけましょう。",
  openGraph: {
    title: "記事検索 | sandbox:/",
    description: "技術記事やプログラミング関連の記事を検索できます。",
  },
};

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
