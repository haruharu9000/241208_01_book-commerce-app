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
          <Image
            src={book.thumbnail.url}
            alt={book.title}
            className="w-full h-80 object-cover object-center"
            width={700}
            height={700}
          />
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <div
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: book.content }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              公開日: {book.created_at}
            </span>
            <span className="text-sm text-gray-500">
              最終更新: {book.updated_at}
            </span>
          </div>
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
