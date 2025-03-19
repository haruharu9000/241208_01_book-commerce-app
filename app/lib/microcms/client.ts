import { createClient } from "microcms-js-sdk";
import { BookType, ArticleType } from "@/app/types/types";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
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
  const allArticles = await client.getList<ArticleType>({
    endpoint: "articles",
    customRequestInit: {
      cache: "no-store",
    },
  });

  return allArticles.contents;
};
// 記事を ID で取得（追加）
export const getArticleById = async (id: string) => {
  const article = await client.get({
    endpoint: "articles",
    contentId: id,
    customRequestInit: {
      cache: "no-store",
    },
  });
  return article;
};

// カテゴリー別の記事一覧を取得
export const getBooksByCategory = async (category: string) => {
  const books = await client.get({
    endpoint: "bookcommerce",
    queries: {
      filters: `category[equals]${category}`,
    },
  });
  return books;
};

// カテゴリー一覧を取得
export const getCategories = async () => {
  const response = await client.get({
    endpoint: "categories",
  });
  return response.contents;
};
