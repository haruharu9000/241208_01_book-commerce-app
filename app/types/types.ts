// MicroCMSのレスポンス型
type MicroCMSType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

// 書籍の型定義
export type Book = {
  title: string;
  content: string;
  price: number;
  thumbnail?: {
    url: string;
    height?: number;
    width?: number;
  };
  description?: string;
  category?: string;
  categoryId?: string;
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

// MicroCMS記事の型定義
export type Article = {
  title: string;
  description: string;
  content: string;
} & MicroCMSType;

export type UserArticle = {
  id: string;
  title: string;
  content: string;
  description?: string;
  isHidden: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
};

export type Bookmark = {
  id: string;
  bookId: string;
  userId: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
};

// カテゴリーの型定義
export type Category = {
  id: string;
  name: string;
  count?: number;
};

// 後方互換性のための型エイリアス
export type BookType = Book;
export type ArticleType = Article;

