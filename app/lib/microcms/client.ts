import { createClient } from "microcms-js-sdk";
import { BookType, ArticleType } from "@/app/types/types";

if (!process.env.MICROCMS_SERVICE_DOMAIN && !process.env.NEXT_PUBLIC_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN or NEXT_PUBLIC_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY && !process.env.NEXT_PUBLIC_API_KEY) {
  throw new Error("MICROCMS_API_KEY or NEXT_PUBLIC_API_KEY is required");
}

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || process.env.NEXT_PUBLIC_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY || process.env.NEXT_PUBLIC_API_KEY;

export const client = createClient({
  serviceDomain: serviceDomain!,
  apiKey: apiKey!,
});

// 書籍一覧を取得
export const getAllBooks = async () => {
  try {
    const allBooks = await client.get({
      endpoint: "bookcommerce",
      queries: { limit: 100 },
      customRequestInit: {
        next: { revalidate: 3600 }
      },
    });
    return allBooks;
  } catch (error) {
    console.error("Error fetching all books:", error);
    throw error;
  }
};

// 書籍の詳細を取得
export const getDetailBook = async (contentId: string) => {
  try {
    const detailBook = await client.getListDetail<BookType>({
      endpoint: "bookcommerce",
      contentId,
      customRequestInit: { cache: "no-store" },
    });
    return detailBook;
  } catch (error) {
    console.error(`Error fetching book detail for ID ${contentId}:`, error);
    throw error;
  }
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
