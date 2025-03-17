import { client } from "@/app/lib/microcms/client";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  console.log("Fetching article with ID:", params.id); // 確認用
  const article = await client
    .get({
      endpoint: "articles",
      contentId: params.id,
    })
    .catch(() => null);

  console.log("Fetched article:", article); // 確認用

  if (!article) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </div>
  );
}
