import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { nextAuthOptions } from "../lib/next-auth/options";

export default async function LoginPage() {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>
        <div className="space-y-4">
          <a
            href="/api/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ログインページへ
          </a>
        </div>
      </div>
    </div>
  );
}
