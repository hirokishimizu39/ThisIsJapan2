# This is Japan - プロジェクトサマリー

## プロジェクト概要

日本の文化や体験を世界に発信するためのプラットフォーム。写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を世界に伝えることを目指します。

- 日本人が日本の魅力を再発見し自国を誇りに思う気持ちを醸成
- 訪日外国人の地方分散と消費額の 30%増加
- 地域の隠れた文化資源の発掘と継承
- 参加する日本人ホストの英会話力, 異文化対応スキル向上と地域活性化

## 主要機能

### 1. 写真共有機能

- 日本の風景や文化的な写真の投稿・閲覧
- いいね・コメント・ブックマーク機能
- 人気順表示

### 2. 日本語・言葉の共有

- 日本語の言葉や概念の投稿
- 英語での説明付き
- いいね・コメント・ブックマーク機能
- 人気順表示

### 3. 文化体験の紹介

- 日本の伝統文化体験の紹介
- 場所情報付き
- 写真付きの詳細説明
- 地図 API を使ったローカルな文化体験の発見
- いいね・コメント・ブックマーク機能

### 4. ユーザー管理

- ユーザー登録・ログイン機能
- 日本人/外国人の区分け
- 言語レベルの設定（母国語、日本語レベル、英語レベル）
- ユーザー別の投稿管理
- マイページでのいいね・ブックマーク管理

## 独自アルゴリズム

- 地域分散アルゴリズム
  - 写真・文化体験は地方であるほど優位になるようにする
    - そのため写真・体験には地域のタグをつける
    - インバウンドの消費額から
- マッチングアルゴリズム
  - 外国人 - 日本人マッチング
    - 未定

## 技術スタック

- **フロントエンド**:

  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui
  - SWR

- **バックエンド**:
  - Django REST Framework
  - PostgreSQL

詳細な技術選定理由については[技術スタック詳細](docs/architecture/technology-stack.md)を参照してください。

## プロジェクト構成

```
dev/
└── ThisIsJapan/
    ├── frontend/                  # Next.js 14 (App Router)
    │   ├── app/                   # フロントエンドのルーティング構造
    │   ├── components/            # UIコンポーネント
    │   ├── hooks/                 # カスタムフック
    │   ├── lib/                   # ライブラリ・APIクライアント
    │   ├── public/                # 静的ファイル
    │   └── styles/                # CSS/Tailwind設定
    │
    └── backend/                   # Django REST Framework
        ├── thisisjapan_api/       # Djangoプロジェクト
        └── app/                   # Djangoアプリ
```

詳細なプロジェクト構成は[システム設計書](docs/architecture/system-architecture.md)を参照してください。

### 本番環境の構成

- フロントエンド: Vercel
- バックエンド: AWS (ECS Fargate)
- データベース: AWS RDS (PostgreSQL)
- ストレージ: AWS S3
- DNS: AWS Route53

## API 設計

バックエンドは Django REST Framework を使用した RESTful API として実装され、OpenAPI 3.0 仕様に準拠しています。

### API ドキュメント

- `/api/docs` - Swagger UI を使用した API 仕様ブラウザ
- `/api/docs/openapi.json` - OpenAPI 3.0 仕様（JSON 形式）

詳細な API エンドポイントについては[API リソース設計書](docs/api/api-specification.md)を参照してください。

## データモデル

主要なエンティティと関連:

- ユーザー（User）: 言語情報を含むプロフィール
- コンテンツ: 写真（Photo）、言葉（Word）、体験（Experience）
- インタラクション: コメント（Comment）、いいね（Like）、ブックマーク（Bookmark）
- 分類: カテゴリ（Category）、タグ（Tag）

詳細なデータモデルについては[DB 設計書](docs/database/database-design.md)を参照してください。

## 開発環境セットアップ

環境構築手順については[環境構築ガイド](docs/SETUP.md)を参照してください。

## 開発フロー

プロジェクトへの貢献方法については[開発参加ガイド](docs/CONTRIBUTING.md)を参照してください。

## デザイン要件

- モダンでミニマルなデザイン
- 日本の美意識を反映（余白、シンプルさ）
- ダークモード対応
- Noto Sans JP, Noto Serif JP フォントの使用

### 主な画面

- ホームページ（写真、言葉、体験のプレビュー）
- 認証ページ（登録・ログイン）
- コンテンツ詳細ページ

### 配色

- メインカラー: インディゴ (224 34% 27%)
- アクセント: 日本の赤 (349 53% 59%)
- 背景: オフホワイト (0 0% 97%)

## ドキュメント構成

- [開発参加ガイド](docs/CONTRIBUTING.md)
- [環境構築ガイド](docs/SETUP.md)
- [システム設計書](docs/architecture/system-architecture.md)
- [技術スタック詳細](docs/architecture/technology-stack.md)
- [DB 設計書](docs/database/database-design.md)
- [API リソース設計書](docs/api/api-specification.md)
- [デプロイメントガイド](docs/deployment/deployment-guide.md)
