"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-gray-700 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Medium
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300">
              ホーム
            </Link>
            {session ? (
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 cursor-pointer"
              >
                ログアウト
              </button>
            ) : (
              <Link href="/profile" className="hover:text-gray-300">
                プロフィール
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
