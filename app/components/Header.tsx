"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

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
          {session ? (
            <>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                ログアウト
              </button>
              <Link href="/profile">
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="プロフィール"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
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
