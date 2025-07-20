"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-[#6a1917] dark:bg-[#d4a574] text-gray-100 dark:text-[#2d1b1a] shadow-lg transition-colors duration-300">
      <nav className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4">
        <Link href="/" className="text-base sm:text-xl font-bold">
          LOG/OS
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-gray-300 dark:text-[#5a4a49] hover:text-white dark:hover:text-[#2d1b1a] px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            ホーム
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-300 dark:text-[#5a4a49] hover:text-white dark:hover:text-[#2d1b1a] px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                ログアウト
              </button>
              <Link href="/profile">
                <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image || "/default-avatar.png"}
                    alt="profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-300 dark:text-[#5a4a49] hover:text-white dark:hover:text-[#2d1b1a] px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
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
