import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { User } from "@/app/types/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = session.user as User;
    const { title, price, bookId } = await request.json();

    // ✅ `success_url` を環境変数に基づいて動的に設定する
    const BASE_URL =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000" // ローカル環境の場合
            : process.env.NEXT_PUBLIC_BASE_URL || "https://24120801book-commerce-app-git-main-haruharu9000s-projects.vercel.app";

    const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        metadata: { bookId },
        client_reference_id: user.id,
        line_items: [{ price_data: { currency: "jpy", product_data: { name: title }, unit_amount: price }, quantity: 1 }],
        mode: "payment",
        success_url: `${BASE_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`, // ✅ 修正
        cancel_url: `${BASE_URL}`, // ✅ 修正
    });

    return NextResponse.json({ checkout_url: stripeSession.url });
}