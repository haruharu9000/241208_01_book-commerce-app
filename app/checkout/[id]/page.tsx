import { getDetailBook } from "@/app/lib/microcms/client";
import { notFound } from "next/navigation";

export default async function CheckoutPage({
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">{book.description}</p>
          <p className="text-xl font-semibold">価格: {book.price}円</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching book:", error);
    return notFound();
  }
}
