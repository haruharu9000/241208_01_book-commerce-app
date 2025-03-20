import { createClient } from "microcms-js-sdk";
import { BookType, ArticleType, Category } from "@/app/types/types";

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
export const getBooksByCategory = async (categoryId: string) => {
  try {
    console.log('Fetching books for categoryId:', categoryId); // デバッグ用
    const response = await client.get({
      endpoint: "bookcommerce",
      queries: {
        filters: `categoryId[equals]${categoryId}`,
      },
    });
    console.log('Books by category response:', response); // デバッグ用
    return response;
  } catch (error) {
    console.error(`Error fetching books for categoryId ${categoryId}:`, error);
    throw error;
  }
};

// カテゴリー一覧を取得
export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories...'); // デバッグ用
    const response = await client.get({
      endpoint: "bookcommerce",
      queries: {
        fields: ['id', 'categoryId', 'category'].join(','),
        limit: 100
      },
    });
    console.log('Categories response:', response); // デバッグ用

    if (!response?.contents?.length) {
      console.log('No contents found in response');
      return [];
    }

    // カテゴリー情報を整形して返す
    const categoriesMap = response.contents.reduce((acc: { [key: string]: Category }, content: BookType) => {
      const categoryId = content.categoryId;
      const categoryName = content.category;
      if (!categoryId || !categoryName) return acc;

      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          name: categoryName,
          count: 1
        };
      } else {
        acc[categoryId].count = (acc[categoryId].count || 0) + 1;
      }
      return acc;
    }, {});

    const categories = Object.values(categoriesMap) as Category[];
    console.log('Processed categories:', categories); // デバッグ用
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// 月別の記事一覧を取得
export const getBooksByMonth = async () => {
  const response = await client.getList<BookType>({
    endpoint: "bookcommerce",
    queries: { limit: 100 },
  });

  const books = response.contents;
  const groupedBooks: { [key: string]: BookType[] } = {};

  books.forEach((book) => {
    const date = new Date(book.createdAt);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    if (!groupedBooks[yearMonth]) {
      groupedBooks[yearMonth] = [];
    }
    groupedBooks[yearMonth].push(book);
  });

  // 月別にソートされた配列を作成
  const sortedMonths = Object.keys(groupedBooks).sort((a, b) => {
    const [yearA, monthA] = a.split('年').map(part => parseInt(part));
    const [yearB, monthB] = b.split('年').map(part => parseInt(part));
    if (yearA !== yearB) return yearB - yearA;
    return monthB - monthA;
  });

  return { groupedBooks, sortedMonths };
};
