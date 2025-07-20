"use client";

import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  // スピナーのサイズや色をカスタマイズできます
  const size = 50;
  const color = "#6b4c3b"; // elegant-primary色

  return (
    <div className="spinner-container flex items-center justify-center min-h-screen bg-elegant-lightBg dark:bg-elegant-darkBg transition-colors duration-300">
      <ClipLoader size={size} color={color} />

      {/* スタイル */}
      <style jsx>{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
