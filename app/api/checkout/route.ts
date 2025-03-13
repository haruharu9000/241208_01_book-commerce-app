import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// `ExtendedUser` 型を定義
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  // `session.user` を `ExtendedUser` 型にキャスト
  const user = session?.user as ExtendedUser | undefined;

  if (!user?.id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { price, title, bookId } = await request.json();
  if (!bookId) {
    return NextResponse.json({ error: "Missing required bookId" }, { status: 400 });
  }

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    metadata: { userId: user.id, bookId },
    line_items: [{
      price_data: {
        currency: "jpy",
        product_data: { name: title },
        unit_amount: price
      },
      quantity: 1
    }],
    mode: "payment",
    success_url: `${BASE_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: BASE_URL,
  });

  return NextResponse.json({ checkout_url: stripeSession.url });
}
