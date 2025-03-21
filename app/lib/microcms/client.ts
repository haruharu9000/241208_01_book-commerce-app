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

export const client = createClient({
  serviceDomain: serviceDomain!,
  apiKey: apiKey!,
});

// 書籍一覧を取得
export const getAllBooks = async () => {
  const allBooks = await client.get({
    endpoint: "bookcommerce",
    queries: { 
      limit: 100,
      fields: ['id', 'title', 'content', 'description', 'price', 'thumbnail', 'category', 'categoryId', 'createdAt', 'updatedAt'].join(',')
    }
  });
  return allBooks;
};

// 書籍の詳細を取得
export const getDetailBook = async (contentId: string) => {
  if (!contentId) {
    throw new Error("contentId is required");
  }

  try {
    const detailBook = await client.get<BookType>({
      endpoint: "bookcommerce",
      contentId,
      queries: {
        fields: ['id', 'title', 'content', 'description', 'price', 'thumbnail', 'category', 'categoryId', 'createdAt', 'updatedAt'].join(',')
      }
    });

    if (!detailBook || !detailBook.id) {
      throw new Error(`Book not found for ID: ${contentId}`);
    }

    return detailBook;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch book: ${error.message}`);
    }
    throw new Error("Unknown error occurred while fetching book");
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

// 記事を ID で取得
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
export const getBooksByCategory = async (categoryId: string) => {
  const response = await client.get({
    endpoint: "bookcommerce",
    queries: {
      filters: `categoryId[equals]${categoryId}`,
      fields: ['id', 'title', 'content', 'description', 'price', 'thumbnail', 'category', 'categoryId', 'createdAt', 'updatedAt'].join(',')
    }
  });
  return response;
};

// カテゴリー一覧を取得
export const getCategories = async (): Promise<Category[]> => {
  const response = await client.get({
    endpoint: "bookcommerce",
    queries: {
      fields: ['id', 'categoryId', 'category'].join(','),
      limit: 100
    },
  });

  if (!response?.contents?.length) {
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

  return Object.values(categoriesMap);
};

// 月別の記事一覧を取得
export const getBooksByMonth = async () => {
  const response = await client.getList<BookType>({
    endpoint: "bookcommerce",
    queries: { limit: 100 }
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
  const response = await client.getList<BookType>({
    endpoint: "bookcommerce",
    queries: {
      limit: 100,
      orders: '-createdAt'
    }
  });

  const books = response.contents;
  return books.filter((book) => {
    const date = new Date(book.createdAt);
    const bookYearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    return bookYearMonth === yearMonth;
  });
};
