# 📚 Book Commerce App

**Book Commerce App** は、Next.js を用いて開発した電子書籍販売プラットフォームです。  
ユーザーは書籍を検索・閲覧し、認証・決済を経て、購入済みのコンテンツにアクセスできます。

本アプリでは、ユーザー認証（NextAuth） や 決済機能（Stripe） といった、Webビジネスにおける重要な2つの基盤機能を実装し、実際のサービス運営に近い構成を意識して開発を行いました。

開発を通じて、フロントエンドからバックエンド、認証、決済、デプロイまでの一連の流れを一貫して経験し、フルスタック領域における実践的なスキルの習得を目指しました。

## ⚙️ 主な機能

- OAuth（GitHub / Google）によるユーザー認証
- 書籍の閲覧（カテゴリ・月別アーカイブに対応）
- 書籍のキーワード検索（ハイライト付き）
- Stripe を利用した決済処理
- 購入履歴の表示と購入済み書籍へのアクセス

## 🛠️ 技術スタック

- **フロントエンド**：Next.js、React、Tailwind CSS を用いたUI開発
- **バックエンド**：Next.js API Routes によるAPI実装
- **認証機能**：NextAuth.js によるOAuth認証（GitHub / Google）
- **データベース**：PostgreSQL + Prisma ORM によるデータ管理
- **コンテンツ管理**：MicroCMS を用いたヘッドレスCMS構築
- **決済機能**：Stripe による決済導入
- **デプロイ**：Vercel によるデプロイ・ホスティング

## ユーザーフロー

### 1. 認証フロー

1. ユーザーが「ログイン」をクリック
2. GitHub/Googleでの認証
3. 認証成功後、ホームページにリダイレクト

### 2. 購入フロー

1. ユーザーが書籍を選択
2. 「購入する」ボタンをクリック
3. 未ログインの場合はログインページへリダイレクト
4. ログイン済みの場合はStripeチェックアウトページへリダイレクト
5. 決済成功後、成功ページに遷移し購入情報がデータベースに保存

### 3. コンテンツアクセスフロー

1. ユーザーがプロフィールページで購入済み書籍を確認
2. 購入済み書籍をクリックしてコンテンツにアクセス
3. 未購入の場合は購入フローへ誘導

## 📁 ディレクトリ構成（概要）

- app/
  - api/：APIルート（checkout、purchases、search など）
  - book/：書籍詳細・購入成功ページ
  - category/：カテゴリー別書籍一覧
  - profile/：ユーザープロフィール（購入履歴）
  - search/：検索ページ
  - components/：再利用可能なUIコンポーネント
  - lib/
    - microcms/：MicroCMS クライアント処理
    - next-auth/：認証設定（NextAuth.js）
    - prisma.ts：Prisma 初期化
  - types/：TypeScript 型定義
  - layout.tsx：アプリ共通レイアウト
- prisma/
  - schema.prisma：データベーススキーマ定義
- public/：画像・アイコンなどの静的アセット

## 🌐 補足

このアプリは技術習得およびポートフォリオ用途として開発されたものです。  
技術選定や構成の考え方にご興味ある方は、お気軽にご連絡いただくか、スター・フォーク等いただければ幸いです。

## MicroCMS コンテンツ作成時の注意点

### 長いテキスト・コードブロック対応

記事の説明文やプレビューで表示される際に横幅がはみ出ることを防ぐため、以下の点にご注意ください：

#### 1. コードブロックの記述方法

```
// 悪い例：改行なしの長いコード
const veryLongVariableNameThatExtendsAcrossTheEntireScreenAndCausesHorizontalScrolling = "value";

// 良い例：適切な改行を含むコード
const longVariableName =
  "適切に改行された値";
```

#### 2. URL の記述方法

```
// 悪い例：改行なしの長いURL
https://github.com/verylongusername/verylongrepositoryname/blob/main/verylongfilename.js

// 良い例：適切に区切られたURL
GitHub リポジトリ:
https://github.com/username/repo
```

#### 3. 説明文の推奨事項

- 1行あたり50-80文字程度で改行
- 長い技術用語は適切な箇所で改行
- コードサンプルは短めに抽出

### 自動対応

CSS側で以下の対策を実装済み：

- `word-break: break-all` による強制改行
- `overflow-wrap: break-word` によるオーバーフロー制御
- `max-width: 100%` による幅制限
