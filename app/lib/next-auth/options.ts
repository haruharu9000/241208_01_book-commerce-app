import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../prisma";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export const nextAuthOptions: NextAuthOptions = {
  debug: true, // デバッグON（Vercelのログで確認する）
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
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // `id` が undefined にならないように修正
        token.image = user.image ?? `https://avatars.githubusercontent.com/u/${token.sub}`;
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      if (!token.id) {
        console.warn("⚠️ Warning: Token ID is undefined!"); // デバッグ用のログ
      }

      return {
        ...session,
        user: {
          id: token.id as string || "unknown", //`undefined` の場合デフォルト値
          name: session.user?.name ?? null,
          email: session.user?.email ?? null,
          image:
            typeof token.image === "string"
              ? token.image
              : `https://avatars.githubusercontent.com/u/${token.sub}`,
        },
      };
    },
  },
};

export type { ExtendedSession };
