import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { nextAuthOptions } from "../lib/next-auth/options";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン",
  description:
    "sandbox:/にログインして技術記事の購入や管理を行うことができます。",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    redirect("/");
  }

  redirect("/api/auth/signin");
}
