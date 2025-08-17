"use client";

import { memo } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // ついでに個別importで軽量化

const LoadingSpinner = memo(function LoadingSpinner() {
  const size = 50;
  const color = "#6b4c3b";
  return (
    <div className="flex items-center justify-center min-h-screen bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors">
      <ClipLoader size={size} color={color} loading />
    </div>
  );
});

export default LoadingSpinner;
