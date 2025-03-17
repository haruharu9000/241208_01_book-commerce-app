import { NextResponse } from "next/server";
import { client } from "@/app/lib/microcms/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("API called with ID:", params.id);
  const articleId = params.id;
  if (!articleId) {
    return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
  }

  try {
    const article = await client.get({
      endpoint: "articles",
      contentId: articleId,
    });

    console.log("Fetched article:", article);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
