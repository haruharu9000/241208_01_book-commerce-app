"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Medium
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログアウト
            </button>
          ) : (
            <Link
              href="/login"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログイン
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
