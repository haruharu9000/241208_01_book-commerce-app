import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

const DetailBook = async ({ params }: { params: { id: string } }) => {
  console.log("Debug - params:", params);
  const id = params.id;
  console.log("Debug - params.id:", id);

  // IDが無効な場合の処理
  if (!id || id === "null") {
    console.error("Invalid ID:", id);
    return notFound();
  }

  try {
    // 本のデータを取得
    const book = await getDetailBook(id);
    console.log("Debug - Fetched book data:", book);

    // データが存在しない場合の処理
    if (!book) {
      console.error("Book not found for ID:", id);
      return notFound();
    }

    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {book.thumbnail && (
            <Image
              src={book.thumbnail.url}
              alt={book.title}
              className="w-full h-80 object-cover object-center"
              width={700}
              height={400}
            />
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: book.content }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            公開日: {book.created_at}
          </span>
          <span className="text-sm text-gray-500">
            最終更新: {book.updated_at}
          </span>
        </div>
      </div>
    );
  } catch (error) {
    // APIエラーのハンドリング
    console.error("Error fetching book data:", error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">エラーが発生しました</h2>
          <p>
            データの取得中に問題が発生しました。しばらくしてからもう一度お試しください。
          </p>
        </div>
      </div>
    );
  }
};

export default DetailBook;
