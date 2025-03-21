import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";
import { User } from "@/app/types/types";

const CheckoutPage = async ({
  searchParams,
}: {
  searchParams: {
    bookId: string;
    userId: string;
    title: string;
    price: string;
    description: string;
  };
}) => {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  if (!user) {
    redirect("/api/auth/signin");
  }

  try {
    const response = await fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/checkout"
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: searchParams.bookId,
          userId: searchParams.userId,
          title: searchParams.title,
          price: parseInt(searchParams.price),
          description: searchParams.description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.checkout_url) {
      throw new Error("Checkout URL not found in response");
    }

    redirect(data.checkout_url);
  } catch (error) {
    console.error("Checkout error:", error);
    throw new Error(
      "決済処理中にエラーが発生しました。もう一度お試しください。"
    );
  }

  // この部分は実行されることはありませんが、TypeScriptの要件を満たすために必要です
  return null;
};

export default CheckoutPage;
