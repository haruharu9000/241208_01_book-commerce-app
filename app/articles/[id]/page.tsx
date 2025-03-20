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
      <div>
        {book.thumbnail && (
          <div className="w-full h-64 object-cover">
            <Image
              src={book.thumbnail.url}
              alt={book.title}
              width={1200}
              height={600}
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <div
            className="prose max-w-none"
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
