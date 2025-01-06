import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const purchase = await prisma.purchase.findMany({
      where: { userId: userId  },
    });
    console.log(purchase);

    return NextResponse.json(purchase);
  } catch (err) {
    console.error(err); // エラーの詳細をログに出力
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
