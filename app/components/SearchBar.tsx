"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="記事を検索..."
          className="w-full px-3 py-2 pl-10 pr-4 text-base border border-elegant-highlight dark:border-elegant-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-elegant-warmAccent dark:focus:ring-elegant-darkBlueHover focus:border-transparent bg-elegant-lightBg dark:bg-elegant-darkBg text-elegant-lightText dark:text-elegant-darkText placeholder-elegant-lightMuted dark:placeholder-elegant-darkMuted transition-colors duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-elegant-lightMuted dark:text-elegant-darkMuted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
