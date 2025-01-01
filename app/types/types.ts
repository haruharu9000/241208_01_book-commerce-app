export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

type BookType = {
  id: number;
  title: string;
  price: number;
  content: string;
  thumbnail: { url: string };
  created_at: string;
  updated_at: string;
};

export type { BookType };