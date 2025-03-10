type BookType = {
  id: string;
  title: string;
  price: number;
  content: string;
  description: string;
  thumbnail: { url: string };
  created_at: string;
  updated_at: string;
};

type User = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

type Purchase = {
  id: string;
  userId: string;
  bookId: string;
  sessionId: string;
  createdAt: string;
  user: User;
};

// 追加: 記事（Article）用の型
type ArticleType = {
  id: string;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type { BookType, User, Purchase, ArticleType };

