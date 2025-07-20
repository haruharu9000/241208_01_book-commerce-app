import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../lib/next-auth/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserArticle } from "../../types/types";
import React from "react";

export default async function ArticlesPage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const articlesResponse = await fetch(`${baseUrl}/api/profile/articles`, {
      cache: "no-store",
    });

    if (!articlesResponse.ok) {
      throw new Error("記事の取得に失敗しました");
    }

    const articles: UserArticle[] = await articlesResponse.json();

    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">マイ記事一覧</h1>
          <div className="flex gap-2">
            <Link
              href="/profile/articles/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              新規作成
            </Link>
            <Link
              href="/profile/articles/hidden"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
            >
              非表示記事
            </Link>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
              >
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/profile/articles/${article.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  <div className="flex gap-2">
                    <Link
                      href={`/profile/articles/${article.id}/edit`}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      編集
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch(`/api/profile/articles/${article.id}`, {
                          method: "PATCH",
                        });
                        window.location.reload();
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      非表示にする
                    </button>
                  </div>
                </div>
                {article.description && (
                  <p className="text-gray-600 mb-2">{article.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  作成日:{" "}
                  {new Date(article.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">記事がまだありません</p>
            <Link
              href="/profile/articles/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              最初の記事を作成する
            </Link>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Articles page error:", error);
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-center">エラー</h1>
        <p className="text-red-600 text-center">
          データの取得中にエラーが発生しました
        </p>
      </div>
    );
  }
}
