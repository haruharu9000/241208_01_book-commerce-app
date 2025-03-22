import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";

// ExtendedUser型を定義
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(request: Request) {
  try {
    // セッション取得を試みる
    const session = await getServerSession(nextAuthOptions);
    console.log("Session data:", session);

    if (!session) {
      console.error("No session found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as ExtendedUser | undefined;
    console.log("User data:", user);

    if (!user?.id) {
      console.error("No user ID in session");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body);

    const { price, title, bookId } = body;
    if (!bookId || !price || !title) {
      console.error("Missing required fields:", { bookId, price, title });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const BASE_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_BASE_URL || "https://24120801book-commerce-app-haruharu9000s-projects.vercel.app";

    console.log("Creating Stripe session...");
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        userId: user.id,
        bookId: bookId
      },
      client_reference_id: user.id,
      line_items: [{
        price_data: {
          currency: "jpy",
          product_data: { name: title },
          unit_amount: price
        },
        quantity: 1
      }],
      mode: "payment",
      success_url: `${BASE_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: BASE_URL,
    });

    console.log("Stripe session created:", stripeSession.id);
    return NextResponse.json({ checkout_url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "決済処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
