import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types";  // User型をインポート

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const { sessionId } = await request.json();
    try {
        // 認証セッションを取得
        const serverSession = await getServerSession(nextAuthOptions);
        if (!serverSession || !serverSession.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const user = serverSession.user as User;  // User型をアサーション

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session.client_reference_id || !session.metadata?.bookId) {
            throw new Error("Missing required session data");
        }

        const existingPurchase = await prisma.purchase.findFirst({
            where: {
                userId: user.id,  // user.idを使用
                bookId: session.metadata?.bookId,
            },
        });

        if (!existingPurchase) {
            const purchase = await prisma.purchase.create({
                data: {
                    userId: user.id,
                    bookId: session.metadata?.bookId,
                },
            });
            return NextResponse.json({ purchase });
        } else {
            return NextResponse.json({ message: "すでに購入済みです。" });
        }
    } catch (err) {
        console.error("Purchase error:", err);  // エラーをログに出力
        return NextResponse.json({ error: "Failed to process purchase data" }, { status: 500 });
    }
}
