import { Metadata } from "next";

export const metadata: Metadata = {
  title: "購入完了",
  description: "記事の購入が正常に完了しました。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
