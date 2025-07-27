import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { NextAuthProvider } from "./lib/next-auth/provider";
import Loading from "./loading";
import { Suspense } from "react";
import Sidebar from "./components/Sidebar";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: {
    default: "sandbox:/ - 知の探求",
    template: "%s - sandbox:/",
  },
  description:
    "テクノロジーから日々の気づき、観測や構築の断片まで。ジャンルには依らず、思考と技術と日常のあいだを行き来しながら、そのプロセスを綴っています。",
  keywords: [
    "プログラミング",
    "Web開発",
    "Next.js",
    "React",
    "TypeScript",
    "テクノロジー",
    "個人ブログ",
    "知的探究",
  ],
  authors: [{ name: "haruaki" }],
  creator: "haruaki",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: process.env.NEXT_PUBLIC_API_URL || "https://sandbox-blog.com",
    title: "sandbox:/ - 知の探求",
    description:
      "テクノロジーから日々の気づき、観測や構築の断片まで。ジャンルには依らず、思考と技術と日常のあいだを行き来しながら、そのプロセスを綴っています。",
    siteName: "sandbox:/",
  },
  twitter: {
    card: "summary_large_image",
    title: "sandbox:/ - 知の探求",
    description:
      "テクノロジーから日々の気づき、観測や構築の断片まで。ジャンルには依らず、思考と技術と日常のあいだを行き来しながら、そのプロセスを綴っています。",
    creator: "@haruaki",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className="bg-elegant-lightBg dark:bg-elegant-darkBg"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <body
        className={`${notoSansJP.className} min-h-screen bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300`}
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <NextAuthProvider>
          <div className="main-container flex flex-col min-h-screen bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300">
            <Header />
            <div className="flex flex-col lg:flex-row max-w-8xl mx-auto px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 gap-6 lg:gap-8 bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300">
              <main className="flex-1 lg:mr-6">
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </main>
              <aside className="w-full lg:w-80 mt-6 lg:mt-0">
                <Suspense fallback={<Loading />}>
                  <Sidebar />
                </Suspense>
              </aside>
            </div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
