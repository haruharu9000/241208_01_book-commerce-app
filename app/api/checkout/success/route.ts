import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    // Stripeセッションの取得
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    // 必要なデータの存在確認
    if (!stripeSession.metadata?.userId || !stripeSession.metadata?.bookId) {
      throw new Error("Missing required session metadata");
    }

    // 購入データがすでに存在するか確認
    let purchase = await prisma.purchase.findFirst({
      where: { sessionId },
    });

    // 購入データが存在しない場合は新規作成
    if (!purchase) {
      purchase = await prisma.purchase.create({
        data: {
          userId: stripeSession.metadata.userId,
          bookId: stripeSession.metadata.bookId,
          sessionId: sessionId,
        },
      });
    }

    return NextResponse.json({ purchase });
  } catch (err) {
    console.error("Error processing purchase:", err);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
