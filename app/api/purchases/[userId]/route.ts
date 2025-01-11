import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// GET ハンドラの定義
export async function GET(
  request: Request,
  { params }: { params: { userId: string } } // 型の明示
) {
  const userId = params.userId;

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    return NextResponse.json(purchases); // 正常なレスポンスを返す
  } catch (err) {
    console.error("Failed to fetch purchases:", err);

    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
