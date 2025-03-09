import { getAllArticles } from "app/lib/microcms/client";
import { ArticleType } from "@/app/types/types";
import Link from "next/link";

export default async function ArticlesPage() {
  const articles: ArticleType[] = await getAllArticles();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
      <ul>
        {articles.map((article: ArticleType) => (
          <li key={article.id} className="mb-4">
            <Link
              href={`/articles/${article.id}`}
              className="text-blue-500 hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
