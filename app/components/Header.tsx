import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { User } from "../types/types";
import LogoutButton from "./LogoutButton";

const Header = async () => {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          Medium
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          <Link
            href={user ? "/profile" : "/api/auth/signin"}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {user ? "プロフィール" : "ログイン"}
          </Link>

          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="プロフィール"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
              <LogoutButton />
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
