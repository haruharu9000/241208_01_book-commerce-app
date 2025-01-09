import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId: userId },
    });
    console.log(purchases);

    return NextResponse.json(purchases);
  } catch (err) {
    console.error("Failed to fetch purchases:", err);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}