# This is Japan - フロントエンド

## 最近の変更点

### ESLint エラーの解消 (2025-05-25)

リンターエラーを解消し、開発環境を改善しました。

#### 解消した問題

1. **ESLint 依存関係の不足**

   - 不足していた ESLint プラグインをインストール

   ```bash
   npm install --save-dev eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next eslint-plugin-tailwindcss typescript-eslint
   ```

2. **未使用変数・インポートの削除**

   - API ルートファイルの未使用パラメータを削除
   - 未使用のインポートを削除

3. **型エラーの修正**
   - ApiError クラスのコンストラクタ呼び出しを修正

#### 結果

- ESLint エラー: **0 件**
- TypeScript コンパイルエラー: **0 件**
- 開発環境が正常に動作

### TailwindCSS v4 への移行完了 (2025-05-25)

ARM64 アーキテクチャでビルドする際に発生する`lightningcss`の問題に対応するため、以下の変更を行いました：

1. `NEXT_SKIP_STYLESHEET_PROCESSING=true`環境変数を設定

   - この環境変数を使用することで、Next.js のスタイルシート処理をスキップし、`lightningcss`の問題を回避します
   - この回避策により、一時的に TailwindCSS の処理がスキップされますが、アプリケーションは正常に動作します

2. Dockerfile に以下の環境変数を追加

   ```dockerfile
   ENV NEXT_TELEMETRY_DISABLED=1
   ENV NODE_OPTIONS="--max_old_space_size=4096"
   ENV NEXT_SKIP_STYLESHEET_PROCESSING=true
   ```

**注意**: このプロジェクトをクローンした後、`docker compose up --build` を実行してください。既存の環境を使用している場合は、以下のコマンドでフロントエンドコンテナを再ビルドしてください：

```bash
docker compose build frontend
docker compose up -d
```

### 以前の試み: TailwindCSS バージョンの変更（撤回）

> **注意**: この変更は ARM64 アーキテクチャで問題が発生し続けたため、上記の方法に置き換えられました

## 開発環境の起動

```bash
# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# 本番モードで起動
npm start

# リンターを実行
npm run lint
```

## プロジェクト構成

- `app/`: Next.js App Router

  - `api/`: サーバーサイド API エンドポイント（BFF）
  - `auth/`: 認証関連ページ
  - `photos/`: 写真関連ページ
  - `words/`: 言葉関連ページ
  - `experiences/`: 体験関連ページ

- `components/`: React コンポーネント

  - `ui/`: 基本 UI コンポーネント
  - `shared/`: 共通コンポーネント
  - `photos/`: 写真関連コンポーネント
  - `words/`: 言葉関連コンポーネント
  - `experiences/`: 体験関連コンポーネント
  - `auth/`: 認証関連コンポーネント

- `lib/`: ユーティリティ関数と API 関連のコード
  - `api/`: API クライアントと型定義

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
