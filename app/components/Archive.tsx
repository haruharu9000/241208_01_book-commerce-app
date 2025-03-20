import Link from "next/link";
import { BookType } from "../types/types";

type ArchiveProps = {
  groupedBooks: { [key: string]: BookType[] };
  sortedMonths: string[];
};

export default function Archive({ groupedBooks, sortedMonths }: ArchiveProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">アーカイブ</h2>
      <ul className="space-y-2">
        {sortedMonths.map((month) => (
          <li key={month}>
            <Link
              href={`/archive/${month}`}
              className="flex justify-between items-center text-gray-700 hover:text-blue-600"
            >
              <span>{month}</span>
              <span className="text-sm text-gray-500">
                ({groupedBooks[month].length})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
