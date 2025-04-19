# 📚 Book Commerce App

**Book Commerce App** は、Next.js を用いて構築された電子書籍販売プラットフォームです。
ユーザーは書籍を閲覧・検索し、認証を経て決済を行い、購入したコンテンツにアクセスできます。


## ⚙️ 主な機能

- OAuth（GitHub / Google）によるユーザー認証
- 書籍の閲覧（カテゴリ・月別アーカイブに対応）
- 書籍のキーワード検索（ハイライト付き）
- Stripe を利用した決済処理
- 購入履歴の表示と購入済み書籍へのアクセス


## 🛠️ 使用技術

- **フレームワーク**：Next.js（App Router）
- **UI**：React, Tailwind CSS
- **認証**：NextAuth.js
- **決済**：Stripe
- **データベース**：Prisma + PostgreSQL
- **CMS**：MicroCMS（ヘッドレスCMS）


## 📁 ディレクトリ構成（概要）

- app/
  ├─ api/           ：APIルート（checkout、purchases、search など）
  ├─ book/          ：書籍詳細・購入成功ページ
  ├─ category/      ：カテゴリー別書籍一覧
  ├─ profile/       ：ユーザープロフィール（購入履歴）
  ├─ search/        ：検索ページ
  ├─ components/    ：再利用可能なUIコンポーネント
  ├─ lib/
  │   ├─ microcms/  ：MicroCMS クライアント処理
  │   ├─ next-auth/ ：認証設定（NextAuth.js）
  │   └─ prisma.ts  ：Prisma 初期化
  ├─ types/         ：TypeScript 型定義
  └─ layout.tsx     ：アプリ共通レイアウト

- prisma/
  └─ schema.prisma  ：データベーススキーマ定義

- public/           ：画像・アイコンなどの静的アセット


## 🌐 補足

このアプリは技術習得およびポートフォリオ用途として開発されたものです。
技術選定や構成の考え方にご興味ある方は、お気軽にご連絡いただくか、スター・フォーク等いただければ幸いです。