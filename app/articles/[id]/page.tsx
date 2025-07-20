import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const book = await getDetailBook(params.id);

    if (!book) {
      return notFound();
    }

    return (
      <div className="px-6 lg:px-12 py-4 sm:py-6">
        {book.thumbnail && (
          <div className="w-full h-48 sm:h-64 object-cover mb-4 sm:mb-6">
            <Image
              src={book.thumbnail.url}
              alt={book.title}
              width={1200}
              height={600}
              className="w-full h-48 sm:h-64 object-cover rounded-xl"
            />
          </div>
        )}
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
            {book.title}
          </h1>
          <div
            className="prose max-w-none text-sm sm:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: book.content }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return notFound();
  }
}
