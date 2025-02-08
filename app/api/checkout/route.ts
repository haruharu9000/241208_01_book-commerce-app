import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { User } from "@/app/types/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const session = await getServerSession(nextAuthOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const user = session.user as User;
        const { title, price, bookId } = await request.json();

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            metadata: {
                bookId: bookId,
            },
            client_reference_id: user.id,
            line_items: [
                {
                    price_data: {
                        currency: "jpy",
                        product_data: {
                            name: title,
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        });

        return NextResponse.json({ checkout_url: stripeSession.url });
    } catch (err) {
        console.error("Checkout error:", err);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}
