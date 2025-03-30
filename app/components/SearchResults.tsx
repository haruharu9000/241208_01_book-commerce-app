import { Book } from "@/app/types/types";
import Link from "next/link";
import Image from "next/image";

interface SearchResultsProps {
  books: Book[];
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

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">検索結果が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {books.map((book) => (
        <Link
          key={book.id}
          href={`/book/${book.id}`}
          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
        >
          <div className="flex items-start p-4">
            {book.thumbnail ? (
              <div className="w-48 h-48 relative flex-shrink-0">
                <Image
                  src={book.thumbnail.url}
                  alt={book.title}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-md flex-shrink-0" />
            )}
            <div className="ml-6 flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {highlightText(book.title, searchQuery)}
              </h2>
              {book.content && (
                <div className="text-sm text-gray-600 line-clamp-3">
                  {highlightText(book.content, searchQuery)}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
