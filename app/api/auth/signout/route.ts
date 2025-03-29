import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/lib/next-auth/options";

export async function POST() {
  try {
    const session = await getServerSession(nextAuthOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "既にログアウトしています" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "ログアウト成功" }, { status: 200 });
  } catch (error) {
    console.error("ログアウトエラー:", error);
    return NextResponse.json(
      { message: "ログアウト処理に失敗しました" },
      { status: 500 }
    );
  }
} 