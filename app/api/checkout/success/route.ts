import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/app/lib/prisma";
import type { ExtendedSession } from "@/app/lib/next-auth/options"; // 型を適用

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const session = await getServerSession(nextAuthOptions) as ExtendedSession; // 型を適用
    console.log("Session Data in API:", session); // デバッグログを追加

    const userId = session.user?.id; // userId を取得

    if (!userId) {
        console.error("Unauthorized: No session found or missing user ID.");
        return NextResponse.json({ error: "User not authenticated or missing ID" }, { status: 401 });
    }

    const { sessionId } = await request.json();
    console.log("Received session ID:", sessionId);

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        if (!stripeSession.client_reference_id || !stripeSession.metadata?.bookId) {
            throw new Error("Missing required session data");
        }

        const purchase = await prisma.purchase.findFirst({
            where: {
                userId: userId,
                bookId: stripeSession.metadata?.bookId,
            },
        });

        if (!purchase) {
            console.error("Purchase not found for user:", userId);
            return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        }

        return NextResponse.json({ purchase });
    } catch (err) {
        console.error("Error retrieving purchase:", err);
        return NextResponse.json({ error: "Failed to retrieve purchase data" }, { status: 500 });
    }
}
