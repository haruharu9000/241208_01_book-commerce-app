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
          className="text-base sm:text-xl font-bold text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-lightBlueHover dark:hover:text-elegant-darkAccent transition-colors duration-200"
        >
          <span>sandbox:</span>
          <span className="dark:text-elegant-darkRedAccent">/</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {/* ダークモード切り替えボタン */}
          <DarkModeToggle />
          <Link
            href="/"
            className="text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-lightBlueHover dark:hover:text-elegant-darkAccent px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            ホーム
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-1 sm:gap-4">
              <LogoutButton />
              {session.user.image && (
                <Link href="/profile">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 relative rounded-full overflow-hidden hover:opacity-80 transition-opacity duration-200">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-lightBlueHover dark:hover:text-elegant-darkAccent px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
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
