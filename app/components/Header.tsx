"use client";

import Link from "next/link";
import React from "react";
import AuthStatus from "./AuthStatus";

const Header = () => {
  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          MindNotes
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          <AuthStatus />
        </div>
      </nav>
    </header>
  );
};

export default Header;
