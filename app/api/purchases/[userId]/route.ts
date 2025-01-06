import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// Dynamic route handler for GET request
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    console.log(purchases);

    return NextResponse.json(purchases);
  } catch (err) {
    console.error(err); // エラー詳細をログに出力
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
