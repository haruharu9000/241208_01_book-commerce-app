import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { nextAuthOptions } from "../lib/next-auth/options";

export default async function LoginPage() {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    redirect("/");
  }

  redirect("/api/auth/signin");
}
