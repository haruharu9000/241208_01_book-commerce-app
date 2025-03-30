import { NextResponse } from "next/server";
import { getListBooks } from "@/app/lib/microcms/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ message: "検索クエリが必要です" }, { status: 400 });
    }

    const books = await getListBooks({
      queries: { q: query }
    });

    if (!books || !books.contents) {
      return NextResponse.json({ message: "記事が見つかりませんでした" }, { status: 404 });
    }

    return NextResponse.json(books.contents);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { message: "検索中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 