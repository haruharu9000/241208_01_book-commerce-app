"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const AuthStatus = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <div className="flex items-center gap-4">
          <Link
            href="/api/auth/signout"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ログアウト
          </Link>
          <Image
            src={session.user?.image || "/default-avatar.png"}
            alt="プロフィール画像"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      ) : (
        <Link
          href="/api/auth/signin"
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          ログイン
        </Link>
      )}
    </div>
  );
};

export default AuthStatus;
