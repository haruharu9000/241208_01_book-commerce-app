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

console.log('MicroCMS Service Domain:', serviceDomain); // デバッグ用

export const client = createClient({
  serviceDomain: serviceDomain!,
  apiKey: apiKey!,
});

// 書籍一覧を取得
export const getAllBooks = async () => {
  try {
    console.log('Fetching all books...'); // デバッグ用
    const allBooks = await client.get({
      endpoint: "bookcommerce",
      queries: { limit: 100 },
      customRequestInit: {
        next: { revalidate: 3600 }
      },
    });
    console.log('Books fetched successfully:', allBooks); // デバッグ用
    return allBooks;
  } catch (error) {
    console.error("Error fetching all books:", error);
    throw error;
  }
};

// 書籍の詳細を取得
export const getDetailBook = async (contentId: string) => {
  try {
    console.log('Fetching book detail for ID:', contentId); // デバッグ用
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
  try {
    console.log('Fetching all articles...'); // デバッグ用
    const allArticles = await client.getList<ArticleType>({
      endpoint: "articles",
      customRequestInit: {
        cache: "no-store",
      },
    });
    return allArticles.contents;
  } catch (error) {
    console.error("Error fetching all articles:", error);
    throw error;
  }
};

// 記事を ID で取得
export const getArticleById = async (id: string) => {
  try {
    console.log('Fetching article for ID:', id); // デバッグ用
    const article = await client.get({
      endpoint: "articles",
      contentId: id,
      customRequestInit: {
        cache: "no-store",
      },
    });
    return article;
  } catch (error) {
    console.error(`Error fetching article for ID ${id}:`, error);
    throw error;
  }
};

// カテゴリー別の記事一覧を取得
export const getBooksByCategory = async (category: string) => {
  try {
    console.log('Fetching books for category:', category); // デバッグ用
    const books = await client.get({
      endpoint: "bookcommerce",
      queries: {
        filters: `category[equals]${category}`,
      },
    });
    return books;
  } catch (error) {
    console.error(`Error fetching books for category ${category}:`, error);
    throw error;
  }
};

// カテゴリー一覧を取得（修正）
export const getCategories = async () => {
  try {
    console.log('Fetching categories...'); // デバッグ用
    const response = await client.get({
      endpoint: "bookcommerce",
      queries: {
        fields: 'category',
        limit: 100
      },
    });
    
    // カテゴリーの重複を除去して返す
    const categories = response.contents
      .map((content: BookType) => content.category)
      .filter((category: string) => category) // null や undefined を除外
      .filter((category: string, index: number, self: string[]) => 
        self.indexOf(category) === index // 重複を除去
      );
    
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
