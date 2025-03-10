import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
    // クエリパラメータから session_id を取得
    const searchParams = new URL(request.url).searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        if (!stripeSession.client_reference_id || !stripeSession.metadata?.bookId) {
            throw new Error("Missing required session data");
        }

        const purchase = await prisma.purchase.findFirst({
            where: { sessionId },
        });

        if (!purchase) {
            console.error("Purchase not found for session ID:", sessionId);
            return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        }

        return NextResponse.json({ purchase });
    } catch (err) {
        console.error("Error retrieving purchase:", err);
        return NextResponse.json({ error: "Failed to retrieve purchase data" }, { status: 500 });
    }
}
