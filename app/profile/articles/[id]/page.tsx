import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../../lib/next-auth/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserArticle } from "../../../types/types";
import React from "react";

export default async function ArticleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const articleResponse = await fetch(
      `${baseUrl}/api/profile/articles/${params.id}`,
      { cache: "no-store" }
    );

    if (!articleResponse.ok) {
      if (articleResponse.status === 404) {
        redirect("/profile/articles");
      }
      throw new Error("記事の取得に失敗しました");
    }

    const article: UserArticle = await articleResponse.json();

    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <div className="flex gap-2">
            <Link
              href={`/profile/articles/${article.id}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              編集
            </Link>
            <Link
              href="/profile/articles"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
            >
              記事一覧に戻る
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {article.description && (
            <div className="text-gray-600 mb-4 italic">
              {article.description}
            </div>
          )}
          <div className="prose max-w-none">
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <div>
            作成日: {new Date(article.createdAt).toLocaleDateString("ja-JP")}
          </div>
          <div>
            最終更新: {new Date(article.updatedAt).toLocaleDateString("ja-JP")}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={async () => {
              await fetch(`/api/profile/articles/${article.id}`, {
                method: "PATCH",
              });
              window.location.href = "/profile/articles";
            }}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            {article.isHidden ? "表示に戻す" : "非表示にする"}
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Article detail page error:", error);
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-center">エラー</h1>
        <p className="text-red-600 text-center">
          データの取得中にエラーが発生しました
        </p>
        <div className="flex justify-center mt-6">
          <Link
            href="/profile/articles"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
          >
            記事一覧に戻る
          </Link>
        </div>
      </div>
    );
  }
}
