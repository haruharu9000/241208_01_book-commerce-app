"use client";

import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  // スピナーのサイズや色をカスタマイズできます
  const size = 50;
  const color = "#6a1917"; // マルーン色

  return (
    <div className="spinner-container flex items-center justify-center min-h-screen bg-[#f5f3f0] dark:bg-[#0f0f0f] transition-colors duration-300">
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
