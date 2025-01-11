import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  console.log("Params received:", params); // デバッグログ追加

  const userId = params.userId;

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });
    console.log("Purchases found:", purchases); // デバッグログ追加

    return NextResponse.json(purchases);
  } catch (err) {
    console.error("Failed to fetch purchases:", err);

    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
