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
    strategy: "jwt", // JWTベースのセッション
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.image = user.image ?? `https://avatars.githubusercontent.com/u/${token.sub}`;
      }

      // GitHubログイン時に `image` をセット
      if (account?.provider === "github" && !token.image) {
        token.image = `https://avatars.githubusercontent.com/u/${token.sub}`;
      }

      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...(session.user as ExtendedUser),
          id: token.id as string,
          // `typeof token.image === "string"` を確認
          image: typeof token.image === "string" ? token.image : `https://avatars.githubusercontent.com/u/${token.sub}`,
        },
      };
    },
  },
};

export type { ExtendedSession };
