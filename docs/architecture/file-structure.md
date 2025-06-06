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
    │   │   │   │   ├── [slug]/        # 写真slug指定
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
    │   │   │   ├── [slug]/         # 写真詳細ページ
    │   │   │   └── new/          # 写真投稿ページ
    │   │   ├── words/            # 言葉関連ページ
    │   │   │   ├── [slug]/         # 言葉詳細ページ
    │   │   │   └── new/          # 言葉投稿ページ
    │   │   ├── experiences/      # 体験関連ページ
    │   │   │   ├── [slug]/         # 体験詳細ページ
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
