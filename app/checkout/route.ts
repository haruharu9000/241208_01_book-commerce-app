import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const { title, price, bookId, userId } = await request.json();

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            metadata: {
                bookId: bookId,
            },
            client_reference_id: userId,
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
            success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${process.env.NEXT_PUBLIC_API_BASE_URL}http://localhost:3000`,
        });

      return NextResponse.json({ checkout_url: session.url });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
      console.error("Unexpected error:", err);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}