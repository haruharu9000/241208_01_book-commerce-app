import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../../../lib/next-auth/options";
import prisma from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = params;

  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
    }

    if (article.userId !== session.user.id) {
      return NextResponse.json(
        { error: "この記事にアクセスする権限がありません" },
        { status: 403 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("記事取得エラー:", error);
    return NextResponse.json(
      { error: "記事の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = params;

  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
    }

    if (existingArticle.userId !== session.user.id) {
      return NextResponse.json(
        { error: "この記事を編集する権限がありません" },
        { status: 403 }
      );
    }

    const { title, content, description } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと内容は必須です" },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        description: description || "",
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("記事更新エラー:", error);
    return NextResponse.json(
      { error: "記事の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = params;

  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
    }

    if (existingArticle.userId !== session.user.id) {
      return NextResponse.json(
        { error: "この記事を編集する権限がありません" },
        { status: 403 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        isHidden: !existingArticle.isHidden,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("記事表示状態更新エラー:", error);
    return NextResponse.json(
      { error: "記事の表示状態の更新に失敗しました" },
      { status: 500 }
    );
  }
}
