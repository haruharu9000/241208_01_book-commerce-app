import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 購入履歴検索API
export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    // 購入履歴を取得
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    // デバッグ用ログ (不要なら削除)
    console.log(purchases);

    // 成功時のレスポンス
    return NextResponse.json(purchases, { status: 200 });
  } catch (error) {
    console.error("Error fetching purchases:", error);

    // エラー時のレスポンス
    return NextResponse.json(
      { error: "Failed to fetch purchases", details: error },
      { status: 500 }
    );
  }
}
