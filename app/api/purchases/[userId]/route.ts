import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// GET ハンドラの定義
export async function GET(
  request: Request,
  context: { params: { userId: string } } // 型定義を修正
) {
  const userId = context.params.userId;

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    return NextResponse.json(purchases);
  } catch (err) {
    console.error("Failed to fetch purchases:", err);

    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
