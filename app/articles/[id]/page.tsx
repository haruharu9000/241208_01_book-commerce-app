import { getArticleById } from "app/lib/microcms/client"; // 記事データ取得関数
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticleById(params.id);
  console.log("Fetched article:", article); // デバッグ用ログ

  if (!article || !article.id) {
    console.error("Article not found:", params.id);
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
      <p className="text-gray-600">{article.description}</p>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
