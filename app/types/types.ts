export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

type BookType = {
  id: number;
  title: string;
  content: string;
  price: number;
  thumbnail: { url: string };
  createdAt: string;
  updateAt: string;
};

export type { BookType };