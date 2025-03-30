// MicroCMSのレスポンス型
type MicroCMSType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

// 書籍の型定義
type BookType = {
  title: string;
  content: string;
  price: number;
  thumbnail: { url: string };
  description: string;
  category: string;
  categoryId: string;
} & MicroCMSType;

// ユーザーの型定義
export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// 購入情報の型定義
export type Purchase = {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  book: {
    id: string;
    title: string;
    thumbnail?: {
      url: string;
    };
  };
};

// 記事の型定義
type ArticleType = {
  title: string;
  description: string;
  content: string;
} & MicroCMSType;

// カテゴリーの型定義
type Category = {
  id: string;
  name: string;
  count?: number;
};

// まとめてエクスポート
export type { BookType, User, Purchase, ArticleType, Category };

export type Book = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  thumbnail?: {
    url: string;
    height: number;
    width: number;
  };
  price: number;
};

