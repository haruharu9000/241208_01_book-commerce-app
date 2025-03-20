import type { MicroCMSContentId, MicroCMSDate } from "microcms-js-sdk";

// 書籍の型定義
type BookType = {
  id: string;
  title: string;
  content: string;
  price: number;
  thumbnail: { url: string } | null;
  description: string;
  category: string;
  categoryId: string;
} & MicroCMSContentId & MicroCMSDate;

// ユーザーの型定義
type User = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

// 購入情報の型定義
type Purchase = {
  id: string;
  userId: string;
  bookId: string;
  sessionId: string;
  createdAt: string;
  user: User;
};

// 記事の型定義
type ArticleType = {
  id: string;
  title: string;
  description: string;
  content: string;
} & MicroCMSContentId & MicroCMSDate;

// カテゴリーの型定義
type Category = {
  id: string;
  name: string;
  count?: number;
};

// まとめてエクスポート
export type { BookType, User, Purchase, ArticleType, Category };

