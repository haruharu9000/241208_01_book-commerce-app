"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DarkModeToggle from "./DarkModeToggle";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-elegant-primary dark:bg-elegant-darkCard text-white dark:text-elegant-darkText transition-colors duration-300 border-b border-elegant-highlight dark:border-elegant-primary">
      <nav className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4">
        <Link
          href="/"
          className="text-base sm:text-xl font-bold text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-accent dark:hover:text-elegant-darkAccent transition-colors duration-200"
        >
          <span>sandbox:</span>
          <span className="dark:text-elegant-darkRedAccent">/</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* ダークモード切り替えボタン */}
          <DarkModeToggle />
          <Link
            href="/"
            className="text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-accent dark:hover:text-elegant-darkAccent px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            ホーム
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-1 sm:gap-2 text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-accent dark:hover:text-elegant-darkAccent px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                {session.user.image && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <span className="hidden sm:inline">
                  {session.user.name || session.user.email}
                </span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-accent dark:hover:text-elegant-darkAccent px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
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
