import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const { sessionId } = await request.json();

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session.client_reference_id || !session.metadata?.bookId) {
            throw new Error("Missing required session data");
        }

        const serverSession = await getServerSession(nextAuthOptions);
        if (!serverSession || !serverSession.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const user = serverSession.user as User;

        const existingPurchase = await prisma.purchase.findFirst({
            where: {
                userId: user.id,
                bookId: session.metadata?.bookId,
            },
        });

        if (!existingPurchase) {
            await prisma.purchase.create({
                data: {
                    userId: user.id,
                    bookId: session.metadata?.bookId,
                },
            });

            return NextResponse.json({ message: "購入完了", sessionUpdated: true });
        } else {
            return NextResponse.json({ message: "すでに購入済みです。" });
        }
    } catch (err) {
        return NextResponse.json(err);
    }
}
