"use client";

import { BookType } from "@/app/types/types";
import Image from "next/image";
import Link from "next/link";

interface SearchResultsProps {
  books: BookType[];
  searchQuery: string;
}

export default function SearchResults({
  books,
  searchQuery,
}: SearchResultsProps) {
  // HTMLタグを除去する関数
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  // 検索クエリをハイライトする関数
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            className="bg-elegant-highlight dark:bg-elegant-primary text-elegant-lightText dark:text-elegant-darkText px-1 rounded"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-elegant-lightMuted dark:text-elegant-darkMuted">
          検索結果が見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {books.map((book) => (
        <Link
          key={book.id}
          href={`/book/${book.id}`}
          className="block bg-white dark:bg-elegant-darkCard rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-elegant-highlight dark:border-elegant-primary"
        >
          <div className="flex flex-col md:flex-row">
            {book.thumbnail ? (
              <div className="w-full md:w-48 h-48 relative flex-shrink-0">
                <Image
                  src={book.thumbnail.url}
                  alt={book.title}
                  fill
                  className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="w-full md:w-48 h-48 bg-elegant-highlight dark:bg-elegant-primary flex-shrink-0 rounded-t-xl md:rounded-l-xl md:rounded-t-none" />
            )}
            <div className="flex-grow min-w-0 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-elegant-lightText dark:text-elegant-darkText leading-tight break-words">
                {highlightText(book.title, searchQuery)}
              </h2>
              {book.content && (
                <div className="text-sm md:text-base text-elegant-lightMuted dark:text-elegant-darkMuted line-clamp-3 leading-relaxed break-words overflow-hidden">
                  {highlightText(stripHtmlTags(book.content), searchQuery)}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
