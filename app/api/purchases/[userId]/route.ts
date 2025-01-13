import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    const { userId } = params;

    // データベースから購入情報を取得
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    return NextResponse.json(purchases);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
