import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  console.log("Context received:", context); // デバッグログ

  const { userId } = context.params;

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });
    console.log("Purchases found:", purchases); // デバッグログ

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error in GET handler:", error); // エラーログ
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
