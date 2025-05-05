# This is Japan - プロジェクトサマリー

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

## プロジェクト構成

```
dev/
└── ThisIsJapan/
    ├── frontend/                  # Next.js 14 (App Router)
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx           # ホームページ
    │   │
    │   │   ├── (auth)/            # 認証関連グループ
    │   │   │   ├── auth/
    │   │   │   │   ├── login/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── register/
    │   │   │   │       └── page.tsx
    │   │   │   ├── dashboard/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── photos/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── words/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── experiences/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── likes/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── bookmarks/
    │   │   │   │       └── page.tsx
    │   │   │   └── settings/
    │   │   │       └── page.tsx
    │   │
    │   │   ├── (content)/         # コンテンツ関連グループ
    │   │   │   ├── photos/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── [id]/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── new/
    │   │   │   │       └── page.tsx
    │   │   │   ├── words/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── [id]/
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── new/
    │   │   │   │       └── page.tsx
    │   │   │   └── experiences/
    │   │   │       ├── page.tsx
    │   │   │       ├── [id]/
    │   │   │       │   └── page.tsx
    │   │   │       └── new/
    │   │   │           └── page.tsx
    │   │
    │   │   └── api/               # API Routes (App Router 仕様)
    │   │       ├── auth/
    │   │       │   ├── login/route.ts
    │   │       │   ├── logout/route.ts
    │   │       │   └── register/route.ts
    │   │       ├── photos/route.ts
    │   │       ├── words/route.ts
    │   │       ├── experiences/route.ts
    │   │       ├── likes/route.ts
    │   │       └── bookmarks/route.ts
    │   │
    │   ├── components/            # UIコンポーネント
    │   ├── hooks/                 # カスタムフック（例: use-auth.ts）
    │   ├── lib/                   # ライブラリ・APIクライアント（例: api-config.ts）
    │   ├── public/                # 静的ファイル（画像など）
    │   ├── styles/                # CSS/Tailwind設定など
    │   ├── tsconfig.json
    │   └── next.config.js
    │
    └── backend/                   # Django REST Framework
        ├── manage.py
        ├── requirements.txt
        ├── thisisjapan_api/       # Djangoプロジェクト
        │   ├── __init__.py
        │   ├── settings.py
        │   ├── urls.py
        │   ├── wsgi.py
        │   └── asgi.py
        │
        └── app/                   # Djangoアプリ（例: users, posts）
            ├── __init__.py
            ├── models.py
            ├── views.py
            ├── serializers.py
            ├── urls.py
            ├── admin.py
            ├── apps.py
            └── tests.py

### 本番環境の構成イメージ
AWS
├── VPC
│   ├── ECS (Fargate)
│   │   └── Django (REST API)
│   ├── RDS (PostgreSQL)
│   └── S3 (静的ファイル / 写真保存)
└── Route53 + ACM (HTTPS)
Vercel
└── Next.js Frontend (環境変数で API URL 指定)

```

## 主要な技術の選定理由

1. **ルーティング**:

   - ファイルベースルーティング採用（App Router）
     - 代替: Pages Router と比較して、より直感的なファイル構造と高度なレイアウト機能を提供
     - 代替: React Router と比較して、ファイルシステムベースの自動ルーティングにより開発効率が向上
   - API ルートを Next.js に統合

2. **認証フロー**:

   - Next.js のミドルウェアで認証チェック
     - 代替: クライアントサイドのみの認証と比較して、より安全で SEO 対応が容易
     - 代替: Auth0 などの外部サービスと比較して、カスタマイズ性が高くコスト効率が良い
   - Django のセッションベースから JWT 認証に変更
     - 代替: セッションベース認証と比較して、ステートレスでスケーラビリティが向上
     - 代替: OAuth2 と比較して、実装の複雑さを抑えつつセキュリティを確保

3. **データフェッチング**:

   - Server Components で SSR 対応
     - 代替: CSR のみと比較して、初期ロード時のパフォーマンスと SEO 対応が向上
     - 代替: GetServerSideProps と比較して、コンポーネントレベルでのデータ取得が可能
   - SWR でクライアントサイドの状態管理
     - 代替: Redux や Zustand と比較して、データフェッチングに特化した軽量な API とキャッシュ機能
     - 代替: TanStack Query と比較して、シンプルな API で MVP 開発の迅速化が可能

4. **パフォーマンス最適化**:
   - 画像最適化（next/image）
     - 代替: 通常の img 要素と比較して、自動的な WebP/AVIF 変換とレスポンシブ対応
     - 代替: 手動の画像最適化と比較して、開発効率と CWV（Core Web Vitals）スコアが向上
   - ルートレベルでのキャッシング
     - 代替: ページ単位のキャッシュと比較して、より細かい粒度での制御が可能
     - 代替: CDN のみのキャッシュと比較して、アプリケーションレベルでの最適化が可能
   - 自動コード分割
     - 代替: 手動のコード分割と比較して、開発者の負担軽減と最適なバンドル生成
     - 代替: 単一バンドルと比較して、初期ロード時間の大幅な短縮を実現

## API 設計

### RESTful API

バックエンドは Django REST Framework を使用した RESTful API として実装され、OpenAPI 3.0 仕様に準拠しています。

```typescript
// フロントエンドからのAPIコール例（photos/route.ts）
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const res = await fetch(`${process.env.DJANGO_API_URL}/api/photos/`);
  const data = await res.json();

  return NextResponse.json(data);
}
```

### API ドキュメント

- `/api/docs` - Swagger UI を使用した API 仕様ブラウザ
- `/api/docs/openapi.json` - OpenAPI 3.0 仕様（JSON 形式）

## Django との連携

1. **認証**:

```python
# Django側でJWTサポート追加
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

2. **CORS 設定**:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-nextjs-app.co",
]
CORS_ALLOW_CREDENTIALS = True
```

3. **Generic Foreign Key の活用**:

```python
# コメント、いいね、ブックマークでGeneric Foreign Keyを活用
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## デプロイメント

1. **Next.js アプリケーション**（Vercel）:

   - ビルドコマンド: `npm run build`
   - 起動コマンド: `npm run start`
   - 環境変数:
     - DJANGO_API_URL=http://localhost:8000

2. **Django バックエンド**（ECS + Fargate）:
   - 起動コマンド: `python manage.py runserver 0.0.0.0:8000`
   - 静的ファイル: `python manage.py collectstatic`

## 開発フロー

1. Next.js アプリケーション開発:

```bash
npm run dev
```

2. Django サーバー起動:

```bash
python manage.py runserver 0.0.0.0:8000
```

## 環境変数

```env
# Next.js
DJANGO_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Django
DEBUG=True
SECRET_KEY=your-django-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

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

## データモデル

### ユーザー（User）

- **ユーザー名**：サービス内での表示名
- **メールアドレス**：ログインや通知に使用
- **パスワード**：ハッシュ化して保存
- **プロフィール画像**：ユーザーの顔写真など
- **自己紹介文**：ユーザーの興味や背景を説明
- **母国語**：ユーザーの母国語
- **日本語レベル**：beginner、intermediate、advanced、native から選択
- **英語レベル**：beginner、intermediate、advanced、native から選択
- **日本人フラグ**：日本人かどうかの区分
- **作成日時**：アカウント作成日
- **更新日時**：プロフィール更新日

### カテゴリ（Category）

- **名前**：カテゴリの名称
- **説明**：カテゴリの詳細説明
- **作成日時**：作成日
- **更新日時**：更新日

### タグ（Tag）

- **名前**：タグの名称（検索やフィルタリングに使用）
- **作成日時**：作成日
- **更新日時**：更新日

### 写真（Photo）

- **タイトル**：写真の名称
- **説明文**：写真の解説
- **画像**：アップロードされた写真データ
- **投稿者**：写真をアップロードしたユーザー
- **カテゴリ**：写真のカテゴリ（自然、建築物、食べ物など）
- **タグ**：関連するキーワード
- **場所名**：撮影された場所の名称
- **緯度・経度**：地図表示のための位置情報
- **作成日時**：投稿日
- **更新日時**：最終更新日

### 言葉（Word）

- **元の言葉**：日本語の単語や表現
- **ふりがな**：読み方の補助
- **翻訳**：英語での意味
- **説明**：言葉の使い方や背景の解説
- **例文**：実際の使用例
- **難易度**：初級、中級、上級などのレベル
- **カテゴリ**：言葉のカテゴリ（日常会話、ビジネス用語など）
- **タグ**：関連するキーワード
- **投稿者**：言葉を投稿したユーザー
- **作成日時**：投稿日
- **更新日時**：最終更新日

### 文化体験（Experience）

- **タイトル**：体験の名称
- **説明文**：体験の詳細説明
- **関連画像**：体験に関する複数の写真
- **住所**：体験できる場所の詳細住所
- **緯度・経度**：地図表示のための位置情報
- **料金情報**：費用の詳細
- **利用可能時間**：営業時間や体験可能な時間帯
- **季節情報**：特定の季節限定かどうか
- **言語サポート**：対応言語（英語対応の有無など）
- **カテゴリ**：体験のカテゴリ（伝統工芸、料理、祭りなど）
- **タグ**：関連するキーワード
- **投稿者**：体験を投稿したユーザー
- **作成日時**：投稿日
- **更新日時**：最終更新日

### コメント（Comment）

- **ID**：コメントの一意識別子
- **投稿者**：コメントを書いたユーザー
- **内容**：コメントのテキスト
- **コンテンツタイプ**：対象コンテンツの種類（写真、言葉、体験）
- **オブジェクト ID**：対象コンテンツの ID
- **作成日時**：投稿日
- **更新日時**：編集日

### いいね（Like）

- **ID**：いいねの一意識別子
- **ユーザー**：いいねしたユーザー
- **コンテンツタイプ**：対象コンテンツの種類（写真、言葉、体験）
- **オブジェクト ID**：対象コンテンツの ID
- **作成日時**：いいねした日時
- **更新日時**：更新日時
- **ユニーク制約**：同じユーザーが同じコンテンツに重複していいねできない

### ブックマーク（Bookmark）

- **ID**：ブックマークの一意識別子
- **ユーザー**：ブックマークしたユーザー
- **コンテンツタイプ**：対象コンテンツの種類（写真、言葉、体験）
- **オブジェクト ID**：対象コンテンツの ID
- **作成日時**：ブックマークした日時
- **更新日時**：更新日時
- **ユニーク制約**：同じユーザーが同じコンテンツに重複してブックマークできない

## 中間テーブル

### Photos_Tags（写真とタグの中間テーブル）

- **ID**：中間テーブルの一意識別子
- **写真 ID**：関連付ける写真の ID
- **タグ ID**：関連付けるタグの ID
- **作成日時**：関連付けた日時
- **更新日時**：更新日時

### Words_Tags（言葉とタグの中間テーブル）

- **ID**：中間テーブルの一意識別子
- **言葉 ID**：関連付ける言葉の ID
- **タグ ID**：関連付けるタグの ID
- **作成日時**：関連付けた日時
- **更新日時**：更新日時

### Experiences_Tags（体験とタグの中間テーブル）

- **ID**：中間テーブルの一意識別子
- **体験 ID**：関連付ける体験の ID
- **タグ ID**：関連付けるタグの ID
- **作成日時**：関連付けた日時
- **更新日時**：更新日時

### Experiences_Photos（体験と写真の中間テーブル）

- **ID**：中間テーブルの一意識別子
- **体験 ID**：関連付ける体験の ID
- **写真 ID**：関連付ける写真の ID
- **作成日時**：関連付けた日時
- **更新日時**：更新日時

## 関連性とメリット

1. **カテゴリとタグによる整理**

   - コンテンツの検索性向上
   - 関連コンテンツの発見しやすさ

2. **位置情報の活用**

   - 地図上での表示が可能
   - 旅行先での近隣コンテンツの発見

3. **インタラクション機能**

   - コメントによる情報の補完
   - いいねによる人気コンテンツの把握
   - ブックマークによるお気に入り保存

4. **多言語対応を考慮した設計**

   - 日本語と英語の橋渡し
   - 言語レベルに応じた表示と機能提供
   - 母国語と学習言語レベルの設定

5. **ユーザーエンゲージメント促進**
   - 投稿、いいね、コメント、ブックマークの循環
   - 日本人と外国人の交流基盤

## API エンドポイント

### 認証関連

```
POST /api/auth/register - ユーザー登録（言語関連情報を含む）
POST /api/auth/login - ログイン
POST /api/auth/logout - ログアウト
GET /api/auth/user - 現在のユーザー情報取得
```

### コンテンツ関連

```
# 写真関連
GET /api/photos - 写真一覧取得
GET /api/photos/top - 人気の写真取得
GET /api/photos/{id} - 特定の写真取得
POST /api/photos - 写真投稿
PUT /api/photos/{id} - 写真更新
DELETE /api/photos/{id} - 写真削除

# 言葉関連
GET /api/words - 言葉一覧取得
GET /api/words/top - 人気の言葉取得
GET /api/words/{id} - 特定の言葉取得
POST /api/words - 言葉投稿
PUT /api/words/{id} - 言葉更新
DELETE /api/words/{id} - 言葉削除

# 体験関連
GET /api/experiences - 体験一覧取得
GET /api/experiences/top - 人気の体験取得
GET /api/experiences/{id} - 特定の体験取得
POST /api/experiences - 体験投稿
PUT /api/experiences/{id} - 体験更新
DELETE /api/experiences/{id} - 体験削除
```

### インタラクション関連

```
# コメント関連
GET /api/photos/{id}/comments - 写真のコメント一覧
POST /api/photos/{id}/comments - 写真にコメント投稿
GET /api/words/{id}/comments - 言葉のコメント一覧
POST /api/words/{id}/comments - 言葉にコメント投稿
GET /api/experiences/{id}/comments - 体験のコメント一覧
POST /api/experiences/{id}/comments - 体験にコメント投稿
DELETE /api/comments/{id} - コメント削除

# いいね関連
POST /api/photos/{id}/like - 写真にいいね
DELETE /api/photos/{id}/like - 写真のいいね取り消し
POST /api/words/{id}/like - 言葉にいいね
DELETE /api/words/{id}/like - 言葉のいいね取り消し
POST /api/experiences/{id}/like - 体験にいいね
DELETE /api/experiences/{id}/like - 体験のいいね取り消し
POST /api/likes - いいね追加（Generic Foreign Key対応）
DELETE /api/likes/{content_type}/{object_id} - いいね削除

# ブックマーク関連
POST /api/photos/{id}/bookmark - 写真をブックマーク
DELETE /api/photos/{id}/bookmark - 写真のブックマーク取り消し
POST /api/words/{id}/bookmark - 言葉をブックマーク
DELETE /api/words/{id}/bookmark - 言葉のブックマーク取り消し
POST /api/experiences/{id}/bookmark - 体験をブックマーク
DELETE /api/experiences/{id}/bookmark - 体験のブックマーク取り消し
POST /api/bookmarks - ブックマーク追加（Generic Foreign Key対応）
DELETE /api/bookmarks/{content_type}/{object_id} - ブックマーク削除
```

### タグ・カテゴリ関連

```
GET /api/tags - タグ一覧取得
GET /api/photos/{id}/tags - 写真のタグ一覧
POST /api/photos/{id}/tags - 写真にタグ追加
DELETE /api/photos/{id}/tags/{tag_id} - 写真からタグ削除
GET /api/words/{id}/tags - 言葉のタグ一覧
POST /api/words/{id}/tags - 言葉にタグ追加
DELETE /api/words/{id}/tags/{tag_id} - 言葉からタグ削除
GET /api/experiences/{id}/tags - 体験のタグ一覧
POST /api/experiences/{id}/tags - 体験にタグ追加
DELETE /api/experiences/{id}/tags/{tag_id} - 体験からタグ削除
```

### ユーザー関連

```
GET /api/users/{id} - ユーザー情報取得
PUT /api/users/{id} - プロフィール更新（言語情報を含む）
GET /api/users/{id}/photos - ユーザーの写真一覧
GET /api/users/{id}/words - ユーザーの言葉一覧
GET /api/users/{id}/experiences - ユーザーの体験一覧
GET /api/users/{id}/likes - ユーザーのいいね一覧
GET /api/users/{id}/bookmarks - ユーザーのブックマーク一覧
```

### 通知関連

```
GET /api/notifications - 通知一覧取得
PUT /api/notifications/{id}/read - 通知を既読に
DELETE /api/notifications/{id} - 通知削除
```

### API ドキュメント

```
GET /api/docs - API仕様書を表示（Swagger UI）
GET /api/docs/openapi.json - OpenAPI仕様（JSON形式）の取得
```

## UI コンポーネント

### メイン

- Header - ヘッダーナビゲーション
- Footer - フッター情報
- TabNavigation - タブ式ナビゲーション

### コンテンツ

- PhotoCard - 写真カード
- WordCard - 言葉カード
- ExperienceCard - 体験カード
- Carousel - カルーセル表示
- CommentSection - コメントセクション
- LikeButton - いいねボタン
- BookmarkButton - ブックマークボタン

### 機能

- InvitationModal - 招待モーダル（3 つの選択肢を提供）
  - "Post for Foreigners" - 外国人向けの投稿
  - "日本人に伝えたい" - 日本人向けの投稿
  - "Just Watch" - 閲覧のみ
- ProtectedRoute - 認証必須ルート
- LanguageSelector - 言語選択コンポーネント

### 認証ミドルウェア

Next.js の middleware.ts により、アクセス制御を実装。特定のページに対してログイン済みユーザーのみアクセス可能とし、未認証の場合は /auth/login にリダイレクト

- クライアントサイドの状態依存による認証判定と比較して、SEO やセキュリティの観点で優れている
- JWT トークンはクッキーに保存し、サーバーサイドで検証

```ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}
```
