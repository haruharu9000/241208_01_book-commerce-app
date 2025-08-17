"use client";

import React, { memo } from "react";
import { ClipLoader } from "react-spinners";

// メモ化でre-renderを防ぐ
const LoadingSpinner = memo(() => {
  // スピナーのサイズや色をカスタマイズできます
  const size = 50;
  const color = "#6b4c3b"; // elegant-primary色

  return (
    <div className="flex items-center justify-center min-h-screen bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300">
      <ClipLoader size={size} color={color} loading={true} />
    </div>
  );
});

export default LoadingSpinner;
