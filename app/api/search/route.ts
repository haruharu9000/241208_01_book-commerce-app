import { NextResponse } from "next/server";
import { getListBooks } from "@/app/lib/microcms/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ message: "検索キーワードを入力してください" }, { status: 400 });
  }

  try {
    const response = await getListBooks({
      queries: {
        q: query,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "検索中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 