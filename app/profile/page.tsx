import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth-options";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type PurchaseWithBook = Prisma.PurchaseGetPayload<{
  include: {
    book: true;
  };
}>;

const ProfilePage = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/login");
  }

  // ユーザーの購入記事を取得
  const purchasedBooks = await prisma.purchase.findMany({
    where: {
      userId: session.user?.id,
    },
    include: {
      book: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }) as PurchaseWithBook[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">プロフィール</h1>

      <div className="mb-8 flex items-center gap-4">
        <Image
          src={session.user?.image || "/default-avatar.png"}
          alt="プロフィール画像"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <p className="text-xl font-semibold">{session.user?.name}</p>
          <p className="text-gray-600">{session.user?.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">購入した記事</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedBooks.map((purchase) => (
          <Link
            href={`/book/${purchase.book.id}`}
            key={purchase.id}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video relative">
              <Image
                src={purchase.book.thumbnail || "/default-book-cover.jpg"}
                alt={purchase.book.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-2">{purchase.book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                購入日: {new Date(purchase.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 line-clamp-2">
                {purchase.book.description}
              </p>
            </div>
          </Link>
        ))}
        {purchasedBooks.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-8">
            まだ購入した記事はありません
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
