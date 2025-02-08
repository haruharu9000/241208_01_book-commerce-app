import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types"; // 型を適用
import { Session } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const session = await getServerSession(nextAuthOptions) as Session & { user: User };
    console.log("Session Data:", session); // デバッグ用ログ

    if (!session?.user?.id) { // **シンプルに記述**
        return NextResponse.json({ error: "User not authenticated or missing ID" }, { status: 401 });
    }

    const user = session.user as User; // 型アサーション

    const { sessionId } = await request.json();
    console.log("Received session ID:", sessionId);

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        if (!stripeSession.client_reference_id || !stripeSession.metadata?.bookId) {
            throw new Error("Missing required session data");
        }

        const purchase = await prisma.purchase.findFirst({
            where: {
                userId: user.id, // 修正
                bookId: stripeSession.metadata?.bookId,
            },
        });

        if (!purchase) {
            return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        }

        return NextResponse.json({ purchase });
    } catch (err) {
        console.error("Error retrieving purchase:", err);
        return NextResponse.json({ error: "Failed to retrieve purchase data" }, { status: 500 });
    }
}
