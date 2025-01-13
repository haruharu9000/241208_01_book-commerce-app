import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// https://nextjs.org/docs/app/building-your-application/routing/router-handlers#dynamic-route-segments
export async function GET(request: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;

  try {
    const purchase = await prisma.purchase.findMany({
      where: { userId },
    });

    return NextResponse.json(purchase);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
