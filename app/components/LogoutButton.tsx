"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      ログアウト
    </button>
  );
};

export default LogoutButton;
