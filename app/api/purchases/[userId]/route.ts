import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 購入履歴検索API
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    // 購入履歴を取得
    const purchases = await prisma.purchase.findMany({
      where: { userId: userId },
    });

    // デバッグ用のログ (不要なら削除)
    console.log(purchases);

    // データをJSON形式で返却
    return NextResponse.json(purchases, { status: 200 });
  } catch (err) {
    console.error("Error fetching purchases:", err);

    // エラー時のレスポンス
    return NextResponse.json(
      { error: "Failed to fetch purchases", details: err },
      { status: 500 }
    );
  }
}