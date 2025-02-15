import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../prisma";

// Extended User 型の定義
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Extended Session 型の定義
interface ExtendedSession extends Session {
  user: ExtendedUser;
}

// NextAuthの設定
export const nextAuthOptions: NextAuthOptions = {
  debug: true, // デバッグON
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // JWTベースのセッションにする
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // JWTに `id` を追加
        token.image = user.image ?? null; // 🔹 プロフィール画像をセット
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...(session.user as ExtendedUser), // 型を適用
          id: token.id as string, // `id` を適用
          image: token.image as string ?? null, // 🔹 画像をセット
        },
      };
    },
  },
};

export type { ExtendedSession };
