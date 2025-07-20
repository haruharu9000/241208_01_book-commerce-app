import { createClient } from "microcms-js-sdk";
import { Book, Article, Category } from "@/app/types/types";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

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
    const data = await client.get({
      endpoint: "bookcommerce",
      contentId,
    });
    return data;
  } catch (error) {
    console.error("Error fetching book detail:", error);
    throw error;
  }
};

// 記事一覧を取得
export const getAllArticles = async (): Promise<Article[]> => {
  try {
    console.log('Fetching all articles...'); // デバッグ用
    const allArticles = await client.getList<Article>({
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
    const categoriesMap = response.contents.reduce((acc: { [key: string]: Category }, content: Book) => {
      const categoryId = content.categoryId;
      const categoryName = content.category;
      
      console.log('Processing book:', { id: content.id, categoryId, categoryName }); // デバッグ用
      
      // categoryIdとcategoryNameの両方が存在する場合のみ処理
      if (categoryId && categoryName) {
        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: categoryId,
            name: categoryName,
            count: 1
          };
        } else {
          acc[categoryId].count = (acc[categoryId].count || 0) + 1;
        }
        console.log('Updated category:', acc[categoryId]); // デバッグ用
      }
      return acc;
    }, {});

    const categories = Object.values(categoriesMap) as Category[];
    console.log('Final processed categories:', categories); // デバッグ用
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// 月別の記事一覧を取得
export const getBooksByMonth = async () => {
  const response = await client.getList<Book>({
    endpoint: "bookcommerce",
    queries: { limit: 100 },
  });

  const books = response.contents;
  const groupedBooks: { [key: string]: Book[] } = {};

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

// 特定の月の記事一覧を取得
export const getBooksBySpecificMonth = async (yearMonth: string) => {
  try {
    const response = await client.getList<Book>({
      endpoint: "bookcommerce",
      queries: { 
        limit: 100,
        orders: '-createdAt'
      },
    });

    const books = response.contents;
    return books.filter((book) => {
      const date = new Date(book.createdAt);
      const bookYearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      return bookYearMonth === yearMonth;
    });
  } catch (error) {
    console.error("Error fetching books for specific month:", error);
    throw error;
  }
};

// 記事一覧を取得（検索機能付き）
export const getListBooks = async (queries?: {
  queries?: {
    q?: string;
  };
}) => {
  try {
    const searchQuery = queries?.queries?.q || "";
    
    // まず全てのコンテンツを取得
    const data = await client.get({
      endpoint: "bookcommerce",
      queries: {
        fields: ["id", "title", "content", "thumbnail", "price", "createdAt", "updatedAt"].join(","),
        limit: 100,
      },
    });
    
    if (!data.contents) {
      return data;
    }

    // 検索クエリが存在する場合、ローカルで検索を実行
    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      data.contents = data.contents.filter((book: Book) => {
        const titleMatch = book.title?.toLowerCase().includes(normalizedQuery);
        const contentMatch = book.content?.toLowerCase().includes(normalizedQuery);
        console.log(`Searching "${normalizedQuery}" in book:`, {
          title: book.title,
          titleMatch,
          contentMatch,
          contentPreview: book.content?.substring(0, 100)
        });
        return titleMatch || contentMatch;
      });
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};
