import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getDetailBook } from "@/app/lib/microcms/client";

//https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: params.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 各購入記事のbook情報を取得
    const purchasesWithBooks = await Promise.all(
      purchases.map(async (purchase) => {
        try {
          const book = await getDetailBook(purchase.bookId);
          return {
            ...purchase,
            book: book,
          };
        } catch (error) {
          console.error(`Error fetching book ${purchase.bookId}:`, error);
          return {
            ...purchase,
            book: null,
          };
        }
      })
    );

    return NextResponse.json(purchasesWithBooks);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { message: "購入履歴の取得に失敗しました" },
      { status: 500 }
    );
  }
}