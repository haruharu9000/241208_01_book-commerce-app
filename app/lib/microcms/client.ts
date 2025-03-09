import { BookType } from "@/app/types/types";
import { createClient } from "microcms-js-sdk";
import { ArticleType } from "@/app/types/types";

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

// 書籍一覧を取得
export const getAllBooks = async () => {
  const allBooks = await client.get({
    endpoint: "bookcommerce",
    customRequestInit: {
      next: { revalidate: 3600 }
    },
  });
  return allBooks;
};

// 書籍の詳細を取得
export const getDetailBook = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "bookcommerce",
    contentId,
    customRequestInit: { cache: "no-store" },
  });
  return detailBook;
};

// 記事一覧を取得
export const getAllArticles = async (): Promise<ArticleType[]> => {
  const allArticles = await client.get<{ contents: ArticleType[] }>({
    endpoint: "articles",
  });

  return allArticles.contents;
};
// 記事を ID で取得（追加）
export const getArticleById = async (id: string) => {
  return await client.get({
    endpoint: "articles", // MicroCMS のエンドポイント名を確認
    queries: { filters: `id[equals]${id}` },
  });
};
