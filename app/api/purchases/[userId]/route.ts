import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    const purchase = await prisma.purchase.findMany({
      where: { userId },
    });
    console.log(purchase);

    return NextResponse.json(purchase);
  } catch (err) {
    console.error(err); // エラーの詳細をログに出力
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}