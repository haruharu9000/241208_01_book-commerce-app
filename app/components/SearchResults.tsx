import Link from "next/link";
import Image from "next/image";
import { BookType } from "../types/types";

interface SearchResultsProps {
  books: BookType[];
  searchQuery: string;
}

export default function SearchResults({
  books,
  searchQuery,
}: SearchResultsProps) {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // HTMLタグを削除する関数
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-base md:text-lg">
          検索結果が見つかりませんでした
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
          className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 max-w-sm md:max-w-none"
        >
          <div className="flex flex-col md:flex-row items-start p-4 md:p-6">
            {book.thumbnail ? (
              <div className="w-full md:w-48 h-48 relative flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <Image
                  src={book.thumbnail.url}
                  alt={book.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0 mb-4 md:mb-0 md:mr-6" />
            )}
            <div className="flex-grow min-w-0">
              <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 leading-tight">
                {highlightText(book.title, searchQuery)}
              </h2>
              {book.content && (
                <div className="text-sm md:text-base text-gray-600 line-clamp-3 leading-relaxed">
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
