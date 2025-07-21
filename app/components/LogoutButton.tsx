"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-elegant-lightBg dark:text-elegant-darkText hover:text-elegant-lightBlueHover dark:hover:text-elegant-darkAccent px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
    >
      ログアウト
    </button>
  );
};

export default LogoutButton;
