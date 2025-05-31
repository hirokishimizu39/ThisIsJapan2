# This is Japan - プロジェクトサマリー

## プロジェクト概要

日本の文化や体験を世界に発信するためのプラットフォーム。写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を世界に伝えることを目指します。

- 日本人が日本の魅力を再発見し自国を誇りに思う気持ちを醸成
- 訪日外国人の地方分散と消費額の 30%増加
- 地域の隠れた文化資源の発掘と継承
- 参加する日本人ホストの英会話力, 異文化対応スキル向上と地域活性化

## 主要機能

### 1. 写真共有機能（フェーズ 1）

- 日本の風景や文化的な写真の投稿・閲覧
- いいね・コメント・ブックマーク機能
- 人気順表示

### 2. 日本語・言葉の共有（フェーズ 1）

- 日本語の言葉や概念の投稿
- 英語での説明付き
- いいね・コメント・ブックマーク機能
- 人気順表示

### 3. 文化体験の紹介（フェーズ 2）

- 日本の伝統文化体験の紹介
- 場所情報付き
- 写真付きの詳細説明
- 地図 API を使ったローカルな文化体験の発見
- いいね・コメント・ブックマーク機能

### 4. ユーザー管理（フェーズ 1）

- ユーザー登録・ログイン機能
- 日本人/外国人の区分け
- 言語レベルの設定（母国語、日本語レベル、英語レベル）
- ユーザー別の投稿管理
- マイページでのいいね・ブックマーク管理

## 独自アルゴリズム（フェーズ 3）

- 地域分散アルゴリズム
  - 写真・文化体験は地方であるほど優位になるようにする
    - そのため写真・体験には地域のタグをつける
    - インバウンドの消費額から
- マッチングアルゴリズム
  - 外国人 - 日本人マッチング
    - 未定

## システムアーキテクチャ

### BFF（Backend for Frontend）アーキテクチャ

Next.js の Route Handlers を BFF として導入し、フロントエンドとバックエンドの責務を明確に分離します。これにより、今後の保守性とスケーラビリティが向上します。

| 項目         | Next.js Route Handlers                                             | Django REST Framework (DRF)                                           |
| ------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 主な役割     | UI 最適化 API（BFF）                                               | DB 操作・業務ロジック API                                             |
| 技術スタック | Next.js / TypeScript                                               | Django / Python                                                       |
| 主な処理内容 | - 認証済みユーザー取得<br>- SWR 用の柔軟 API<br>- 表示用データ整形 | - 認証・ユーザー管理<br>- 投稿/ブックマーク/通知処理<br>- DB 直接操作 |
| データ通信   | クライアント → Route Handlers → DRF                                | DRF → PostgreSQL など                                                 |

#### 連携構成（全体図）

```
[Browser]
  ↓ fetch（SWRなど）
[Next.js Route Handlers]
  ↓ proxy + 加工（token, 整形など）
[Django REST API]
  ↓
[Database / 認証サービス]
```

#### 主な設計ポイント

- Next.js Route Handlers は UI 要件に即した柔軟な API エンドポイントを提供（例: `/api/photos`）
- DRF は純粋な業務 API（例: `/api/v1/photos/`）として、ロジックと DB 処理に集中
- 認証トークン（JWT やセッション）は Route Handlers 経由で DRF に伝達
- 表示順、翻訳、多言語対応などは Route Handlers 側で担当
- 型共有には openapi-typescript 等で共通型管理を検討

## 技術スタック

- **フロントエンド**:

  - Next.js 15.3.1 (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui
  - SWR（データフェッチング）

- **BFF（Backend for Frontend）**:

  - Next.js Route Handlers
  - TypeScript
  - API 型定義（OpenAPI 連携）

- **バックエンド**:
  - Django REST Framework
  - PostgreSQL
  - JWT 認証

詳細な技術選定理由については[技術スタック詳細](docs/architecture/technology-stack.md)を参照してください。

## プロジェクト構成

```
dev/
└── ThisIsJapan/
    ├── frontend/                  # Next.js 15.3.1 (App Router)
    │   ├── app/                   # フロントエンドのルーティング構造
    │   │   ├── api/               # Route Handlers (BFF、モバイルアプリとの互換性を取るためには、v1とかバージョン管理すると良い)
    │   │   │   ├── auth/          # 認証関連API
    │   │   │   ├── photos/          # 写真関連API
    │   │   │   │   ├── route.ts     # 写真一覧取得 (GET) / 新規作成 (POST)
    │   │   │   │   ├── [id]/        # 写真ID指定
    │   │   │   │       ├── route.ts # 写真詳細取得 (GET) / 更新 (PUT, PATCH) / 削除 (DELETE)
    │   │   │   │       ├── likes/   # 写真に対するいいね
    │   │   │   │           └── route.ts # いいね追加 (POST) / 削除 (DELETE)
    │   │   │   ├── words/         # 言葉関連API
    │   │   │   ├── experiences/   # 体験関連API
    │   │   │   ├── users/         # ユーザー関連API
    │   │   │   └── notifications/ # 通知関連API
    │   │   ├── (auth)/           # 認証関連ルート
    │   │   │   ├── login/        # ログインページ
    │   │   │   └── register/     # ユーザー登録ページ
    │   │   ├── dashboard/        # ダッシュボード
    │   │   │   ├── photos/       # ユーザーの写真一覧
    │   │   │   ├── words/        # ユーザーの言葉一覧
    │   │   │   ├── experiences/  # ユーザーの体験一覧
    │   │   │   ├── likes/        # ユーザーのいいね一覧
    │   │   │   └── bookmarks/    # ユーザーのブックマーク一覧
    │   │   ├── photos/           # 写真関連ページ
    │   │   │   ├── [id]/         # 写真詳細ページ
    │   │   │   └── new/          # 写真投稿ページ
    │   │   ├── words/            # 言葉関連ページ
    │   │   │   ├── [id]/         # 言葉詳細ページ
    │   │   │   └── new/          # 言葉投稿ページ
    │   │   ├── experiences/      # 体験関連ページ
    │   │   │   ├── [id]/         # 体験詳細ページ
    │   │   │   └── new/          # 体験投稿ページ
    │   │   ├── tags/             # タグ一覧ページ
    │   │   ├── notifications/    # 通知一覧ページ
    │   │   ├── settings/         # ユーザー設定ページ
    │   │   ├── layout.tsx        # アプリケーション全体のレイアウト
    │   │   └── page.tsx          # ホームページ
    │   ├── components/            # UIコンポーネント
    │   ├── hooks/                 # カスタムフック
    │   ├── lib/                   # ライブラリ・APIクライアント
    │   │   ├── api/              # API関連ユーティリティ
    │   │   │   ├── client.ts     # DRF APIクライアント
    │   │   │   └── types/        # API型定義（OpenAPI連携によって自動生成）
    │   ├── public/                # 静的ファイル
    │   └── styles/                # CSS/Tailwind設定
    │
    └── backend/                   # Django REST Framework
        ├── thisisjapan_api/       # Djangoプロジェクト
        │   ├── settings/          # 設定ファイル
        │   ├── urls.py            # メインURLルーティング
        │   └── wsgi.py            # WSGIエントリーポイント
        └── apps/                  # Djangoアプリケーション
            ├── authentication/    # 認証関連のAPI
            │   ├── urls.py        # 認証エンドポイントのURL設定
            │   └── views.py       # 認証ビュー
            ├── photos/            # 写真関連のAPI
            │   ├── urls.py        # 写真エンドポイントのURL設定
            │   └── views.py       # 写真ビュー
            ├── words/             # 言葉関連のAPI
            │   ├── urls.py        # 言葉エンドポイントのURL設定
            │   └── views.py       # 言葉ビュー
            ├── experiences/       # 体験関連のAPI
            │   ├── urls.py        # 体験エンドポイントのURL設定
            │   └── views.py       # 体験ビュー
            ├── common/            # 共通機能（コメント、いいね、ブックマーク等）
            │   ├── urls.py        # 共通エンドポイントのURL設定
            │   └── views.py       # 共通ビュー
            ├── users/             # ユーザー関連のAPI
            │   ├── urls.py        # ユーザーエンドポイントのURL設定
            │   └── views.py       # ユーザービュー
            └── notifications/     # 通知関連のAPI
                ├── urls.py        # 通知エンドポイントのURL設定
                └── views.py       # 通知ビュー
```

詳細なプロジェクト構成は[システム設計書](docs/architecture/system-architecture.md)を参照してください。

### 本番環境の構成

- フロントエンド: Vercel
- バックエンド: AWS (ECS Fargate)
- データベース: AWS RDS (PostgreSQL)
- ストレージ: AWS S3
- DNS: AWS Route53

## API 設計

### バックエンド API (Django REST Framework)

バックエンドは Django REST Framework を使用した RESTful API として実装され、OpenAPI 3.0 仕様に準拠しています。バージョニングを導入し、`/api/v1/` のようなプレフィックスでアクセスします。

### フロントエンド API (Next.js Route Handlers)

フロントエンドの Route Handlers は、UI 要件に特化したエンドポイントを提供し、バックエンド API の呼び出し、レスポンスの整形、認証トークン管理などを担当します。`/api/photos` のようなエンドポイントで公開されます。

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

### BFF 開発フロー

1. バックエンド API の仕様理解と連携確認
2. Route Handlers の実装（認証、データ整形）
3. フロントエンドコンポーネントとの連携テスト

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
- [デザイン]()

詳細な変更内容については、 `frontend/README.md` を参照してください。
