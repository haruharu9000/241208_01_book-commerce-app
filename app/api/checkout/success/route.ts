import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types";
import { Session } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const session = await getServerSession(nextAuthOptions) as Session & { user: User };
    console.log("Session Data:", session); // デバッグログ追加

    if (!session || !session.user || !session.user.id) { // `session.user.id` があるかを厳密にチェック
        console.error("Session is missing user ID", session);
        return NextResponse.json({ error: "User not authenticated or missing ID" }, { status: 401 });
    }

    const user = session.user;

    const { sessionId } = await request.json();
    console.log("Received session ID:", sessionId);

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        console.log("Stripe Session:", stripeSession); // デバッグログ

        if (!stripeSession.client_reference_id || !stripeSession.metadata?.bookId) {
            throw new Error("Missing required session data");
        }

        const purchase = await prisma.purchase.findFirst({
            where: {
                userId: user.id,
                bookId: stripeSession.metadata.bookId,
            },
        });

        if (!purchase) {
            console.error("Purchase not found", user.id, stripeSession.metadata.bookId);
            return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        }

        return NextResponse.json({ purchase });
    } catch (err) {
        console.error("Error retrieving purchase:", err);
        return NextResponse.json({ error: "Failed to retrieve purchase data" }, { status: 500 });
    }
}
