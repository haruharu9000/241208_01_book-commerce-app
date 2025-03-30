import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { redirect } from "next/navigation";
import { Purchase } from "@/app/types/types";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // 購入済み記事を取得
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const purchasesResponse = await fetch(
    `${baseUrl}/api/purchases/${session.user.id}`,
    { cache: "no-store" }
  );
  const purchases: Purchase[] = await purchasesResponse.json();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">購入済み記事一覧</h1>
      <div className="grid gap-4">
        {purchases.map((purchase) => (
          <Link
            key={purchase.id}
            href={`/book/${purchase.bookId}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {purchase.book.thumbnail && (
                <Image
                  src={purchase.book.thumbnail.url}
                  alt={purchase.book.title}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{purchase.book.title}</h2>
                <p className="text-gray-600 mt-2">
                  購入日:{" "}
                  {new Date(purchase.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
