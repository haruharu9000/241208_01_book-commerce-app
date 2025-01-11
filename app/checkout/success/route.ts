import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export async function POST(request: Request) {
  const { sessionId } = await request.json(); // リクエストボディから`sessionId`を取得

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId in request body" }, { status: 400 });
  }

  try {
    // Stripeセッションを取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.client_reference_id || !session.metadata?.bookId) {
      throw new Error("Missing required session data");
    }

    // 既存購入データを確認
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.client_reference_id,
        bookId: session.metadata.bookId,
      },
    });

    if (!existingPurchase) {
      // 購入データがない場合、新たに作成
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.client_reference_id,
          bookId: session.metadata.bookId,
        },
      });
      return NextResponse.json({ purchase });
    } else {
      // 既存の購入データがある場合
      return NextResponse.json({ message: "既に購入済みです。" });
    }
  } catch (err) {
    console.error("Error in /api/checkout/success:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
