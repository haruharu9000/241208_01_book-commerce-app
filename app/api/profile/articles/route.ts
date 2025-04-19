import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../../lib/next-auth/options";
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const showHidden = searchParams.get("hidden") === "true";

  try {
    const articles = await prisma.article.findMany({
      where: {
        userId: session.user.id,
        isHidden: showHidden,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("記事一覧取得エラー:", error);
    return NextResponse.json(
      { error: "記事一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const { title, content, description } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと内容は必須です" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        description: description || "",
        userId: session.user.id,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("記事作成エラー:", error);
    return NextResponse.json(
      { error: "記事の作成に失敗しました" },
      { status: 500 }
    );
  }
}
