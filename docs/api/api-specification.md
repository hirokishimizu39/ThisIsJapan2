# API リソース設計書

## アーキテクチャ概要

本プロジェクトは、BFF（Backend for Frontend）アーキテクチャを採用しています。2 種類の API が存在します：

1. **フロントエンド API**: Next.js Route Handlers による BFF（UI 要件に最適化された API）
2. **バックエンド API**: Django REST Framework による RESTful API（ビジネスロジックとデータ処理）

### API フロー

```
[ブラウザ/クライアント] → [Next.js Route Handlers] → [Django REST API] → [Database]
```

- **クライアント →BFF**: UI に最適化された単純なリクエスト（`/api/photos`など）
- **BFF→ バックエンド**: 内部通信、認証トークンの受け渡し（`/api/v1/photos/`など）

## フロントエンド URL 設計

### 認証・ユーザー関連

```
/ - ホームページ
/home - ホームページ
/auth/login - ログインページ
/auth/register - ユーザー登録ページ
/dashboard - ユーザーダッシュボード
/dashboard/photos - ユーザーの写真投稿一覧
/dashboard/words - ユーザーの言葉投稿一覧
/dashboard/experiences - ユーザーの体験投稿一覧
/dashboard/likes - ユーザーのいいね一覧
/dashboard/bookmarks - ユーザーのブックマーク一覧
/settings - ユーザー設定ページ
```

### コンテンツ関連

```
# 写真
/photos - 写真一覧ページ
/photos/[id] - 写真詳細ページ
/photos/new - 写真投稿ページ

# 言葉
/words - 言葉一覧ページ
/words/[id] - 言葉詳細ページ
/words/new - 言葉投稿ページ

# 体験
/experiences - 体験一覧ページ
/experiences/[id] - 体験詳細ページ
/experiences/new - 体験投稿ページ

# UX向上
/tags - タグ一覧ページ
/notifications - 通知一覧ページ
```

## API エンドポイント設計

### フロントエンド API（Next.js Route Handlers）

フロントエンド API は、UI 要件を満たすための最適化されたエンドポイントを提供します。

```
# 認証関連
POST /api/auth/register - ユーザー登録
POST /api/auth/login - ログイン
POST /api/auth/logout - ログアウト
POST /api/auth/refresh - リフレッシュトークンによる更新
GET /api/auth/me - 現在のユーザー情報取得

# 写真関連
GET /api/photos - 写真一覧取得（UI最適化、フィルタリング、ソート）
GET /api/photos/popular - 人気の写真取得
GET /api/photos/[id] - 特定の写真取得（コメント、いいね、タグ情報も含む）
POST /api/photos - 写真投稿
PUT /api/photos/[id] - 写真更新
DELETE /api/photos/[id] - 写真削除
POST /api/photos/[id]/like - いいね追加/削除（トグル式）
POST /api/photos/[id]/bookmark - ブックマーク追加/削除（トグル式）
POST /api/photos/[id]/comments - コメント投稿

# 言葉関連
GET /api/words - 言葉一覧取得
GET /api/words/popular - 人気の言葉取得
GET /api/words/[id] - 特定の言葉取得
# 以下、写真と同様の構成

# 体験関連
GET /api/experiences - 体験一覧取得
GET /api/experiences/popular - 人気の体験取得
GET /api/experiences/[id] - 特定の体験取得
# 以下、写真と同様の構成

# タグ関連
GET /api/tags - タグ一覧取得

# 通知関連
GET /api/notifications - 通知一覧取得
PUT /api/notifications/read-all - すべての通知を既読に
PUT /api/notifications/[id] - 通知ステータス更新

# ユーザー関連
GET /api/user/[id] - ユーザー情報取得
PUT /api/user/me - 自分のプロフィール更新
GET /api/user/me/dashboard - ダッシュボード情報を一括取得
```

#### BFF のメリット

- **データ集約**: 複数のバックエンド API コールを 1 つのエンドポイントにまとめる（例: ダッシュボード情報）
- **UI 特化**: クライアントが必要とする形式にデータを整形
- **認証管理**: トークンの安全な管理と受け渡し
- **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージ

### バックエンド API（Django REST Framework）

バックエンド API は、ビジネスロジックとデータベース操作のために設計されています。（OpenAPI 3.0 仕様に準拠、[セマンティックバージョニング](https://semver.org/lang/ja/)を導入）

```
# 認証関連
POST /api/v1/auth/register - ユーザー登録（言語関連情報を含む）
POST /api/v1/auth/login - ログイン
POST /api/v1/auth/logout - ログアウト
GET /api/v1/auth/user - 現在のユーザー情報取得
POST /api/v1/auth/token/refresh - リフレッシュトークンによる更新

# 写真関連
GET /api/v1/photos - 写真一覧取得（クエリパラメータでフィルタリング）
GET /api/v1/photos/popular - 人気の写真取得
GET /api/v1/photos/{id} - 特定の写真取得
POST /api/v1/photos - 写真投稿
PUT /api/v1/photos/{id} - 写真更新
DELETE /api/v1/photos/{id} - 写真削除
POST /api/v1/photos/{id}/like - 写真にいいね
DELETE /api/v1/photos/{id}/like - いいね取り消し
POST /api/v1/photos/{id}/bookmark - 写真をブックマーク
DELETE /api/v1/photos/{id}/bookmark - ブックマーク取り消し
GET /api/v1/photos/{id}/comments - コメント一覧取得
POST /api/v1/photos/{id}/comments - コメント投稿
GET /api/v1/photos/{id}/tags - タグ一覧取得
POST /api/v1/photos/{id}/tags - タグ追加
DELETE /api/v1/photos/{id}/tags/{tag_id} - タグ削除
```

言葉（words）と体験（experiences）も同様のエンドポイント構造を持ちます。

### コメント関連（共通）

```
DELETE /api/v1/comments/{comment_id} - コメント削除
```

### いいね関連（共通）

```
POST /api/v1/likes - いいね追加（Generic Foreign Key対応）
DELETE /api/v1/likes/{content_type}/{object_id} - いいね削除
```

### ブックマーク関連（共通）

```
POST /api/v1/bookmarks - ブックマーク追加（Generic Foreign Key対応）
DELETE /api/v1/bookmarks/{content_type}/{object_id} - ブックマーク削除
```

### タグ関連（共通）

```
GET /api/v1/tags - タグ一覧取得
```

### 通知関連

```
GET /api/v1/notifications - 通知一覧取得
POST /api/v1/notifications - 通知作成（システム通知用）
PUT /api/v1/notifications/{id} - 通知更新
GET /api/v1/notifications/{id} - 特定の通知取得
PUT /api/v1/notifications/{id}/read - 通知を既読に
PUT /api/v1/notifications/read-all - すべての通知を既読に
DELETE /api/v1/notifications/{id} - 通知削除
```

### ユーザー関連

```
GET /api/v1/user/{id} - ユーザー情報取得
GET /api/v1/user/{id}/photos - ユーザーの写真一覧
GET /api/v1/user/{id}/words - ユーザーの言葉一覧
GET /api/v1/user/{id}/experiences - ユーザーの体験一覧
GET /api/v1/user/{id}/likes - ユーザーのいいね一覧
GET /api/v1/user/{id}/bookmarks - ユーザーのブックマーク一覧
PUT /api/v1/user/{id} - プロフィール更新（言語情報を含む）
```

## API リクエスト/レスポンス構造例

### ユーザー登録

**フロントエンド API リクエスト**

```json
POST /api/auth/register
{
  "username": "tanaka_jp",
  "password": "securepassword123",
  "is_japanese": true,
  "native_language": "japanese",
  "japanese_level": "native",
  "english_level": "intermediate"
}
```

**バックエンド API リクエスト（BFF から）**

```json
POST /api/v1/auth/register
{
  "username": "tanaka_jp",
  "password": "securepassword123",
  "is_japanese": true,
  "native_language": "japanese",
  "japanese_level": "native",
  "english_level": "intermediate"
}
```

**レスポンス**

```json
{
  "id": 1,
  "username": "tanaka_jp",
  "is_japanese": true,
  "native_language": "japanese",
  "japanese_level": "native",
  "english_level": "intermediate",
  "created_at": "2023-06-01T12:34:56Z",
  "updated_at": "2023-06-01T12:34:56Z"
}
```

### コメント投稿

**フロントエンド API リクエスト**

```json
POST /api/photos/1/comments
{
  "content": "素晴らしい写真ですね！"
}
```

**バックエンド API リクエスト（BFF から）**

```json
POST /api/v1/photos/1/comments
{
  "content": "素晴らしい写真ですね！"
}
```

**レスポンス**

```json
{
  "id": 1,
  "content": "素晴らしい写真ですね！",
  "user": {
    "id": 1,
    "username": "tanaka_jp"
  },
  "content_type": "photo",
  "object_id": 1,
  "created_at": "2023-06-01T13:45:12Z",
  "updated_at": "2023-06-01T13:45:12Z"
}
```

### ダッシュボード情報取得（BFF の利点を示す例）

**フロントエンド API リクエスト**

```
GET /api/user/me/dashboard
```

**フロントエンド API レスポンス**

```json
{
  "user": {
    "id": 1,
    "username": "tanaka_jp",
    "profile_image": "https://example.com/images/profile/1.jpg"
  },
  "stats": {
    "photos_count": 12,
    "words_count": 5,
    "experiences_count": 3,
    "likes_received": 45,
    "bookmarks_received": 8
  },
  "recent_photos": [
    {
      "id": 23,
      "title": "東京の夜景",
      "image_url": "https://example.com/images/photos/23.jpg",
      "likes_count": 15
    }
    // 他の写真...
  ],
  "recent_notifications": [
    {
      "id": 5,
      "message": "山田さんがあなたの写真にいいねしました",
      "created_at": "2023-06-05T09:23:11Z"
    }
    // 他の通知...
  ]
}
```

**バックエンドでの実装（BFF 内部で複数の API 呼び出し）**

```typescript
// BFF内のRoute Handler実装例
async function GET(request: Request) {
  // 認証トークン取得
  const token = getAuthToken(request);

  // 並列でバックエンドAPIを呼び出し
  const [
    userResponse,
    photosResponse,
    wordsResponse,
    experiencesResponse,
    notificationsResponse,
  ] = await Promise.all([
    fetch("/api/v1/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("/api/v1/user/me/photos?limit=5", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("/api/v1/user/me/words?limit=5", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("/api/v1/user/me/experiences?limit=5", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch("/api/v1/notifications?limit=5&status=unread", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  // 各レスポンスをJSON化
  const [user, photos, words, experiences, notifications] = await Promise.all([
    userResponse.json(),
    photosResponse.json(),
    wordsResponse.json(),
    experiencesResponse.json(),
    notificationsResponse.json(),
  ]);

  // 統合レスポンスを作成
  return Response.json({
    user: {
      id: user.id,
      username: user.username,
      profile_image: user.profile_image,
    },
    stats: {
      photos_count: photos.total,
      words_count: words.total,
      experiences_count: experiences.total,
      likes_received: user.likes_received,
      bookmarks_received: user.bookmarks_received,
    },
    recent_photos: photos.items.map(formatPhoto),
    recent_words: words.items.map(formatWord),
    recent_experiences: experiences.items.map(formatExperience),
    recent_notifications: notifications.results.map(formatNotification),
  });
}
```

このように、BFF パターンを使用することで、フロントエンドの要件に最適化された効率的な API を提供できます。

## OpenAPI 3.0 仕様

API の詳細な仕様は、OpenAPI 3.0 フォーマットで`docs/api/openapi.yaml`に定義されています。このドキュメントには以下の情報が含まれています：

- API 全体の基本情報（タイトル、説明、バージョン）
- 利用可能なサーバー環境の定義
- 認証方式（JWT Bearer 認証）
- データモデルのスキーマ定義
- 全 API エンドポイントの詳細（パス、メソッド、パラメータ、リクエスト/レスポンス形式）

### Swagger UI による閲覧

Django REST Framework の設定により、バックエンド API ドキュメントは以下の URL で閲覧できます：

- 開発環境: `http://localhost:8000/api/docs/`
- 本番環境: `https://api.thisisjapan.example.com/api/docs/`

### OpenAPI 仕様の活用方法

OpenAPI 仕様は以下のような用途に活用できます：

1. **API 仕様の視覚的な確認**：Swagger UI で各エンドポイントの詳細を確認
2. **クライアントコードの自動生成**：OpenAPI Generator 等のツールを使用
3. **TypeScript 型の自動生成**：openapi-typescript を使用してフロントエンド用の型定義を生成
4. **テストの自動化**：Postman などのツールでコレクションをインポート
5. **API 仕様の文書化**：開発者間での仕様共有

### Generic Foreign Key の実装

コメント、いいね、ブックマーク機能は、Django ContentType フレームワークを使用した Generic Foreign Key で実装されています。これにより、異なる種類のコンテンツ（写真、言葉、体験）に対して同じインタラクション機能を再利用できます。

```python
# Djangoでの実装例
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')
```

### 通知システムの実装

通知システムも同様に、Django ContentType フレームワークを使用して実装されています。これにより、様々なタイプのコンテンツ（写真、言葉、体験）に関連する通知を統一的に扱うことができます。

```python
# 通知モデルの実装例
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Notification(models.Model):
    recipient = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)
    actor = models.ForeignKey(User, related_name='actions', null=True, blank=True, on_delete=models.SET_NULL)
    action_type = models.CharField(max_length=50)  # like, comment, bookmark など
    content_type = models.ForeignKey(ContentType, null=True, blank=True, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    message = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default='unread')  # unread, read, archived, deleted
    group_id = models.CharField(max_length=100, null=True, blank=True)  # 類似通知のグルーピング用(ex. Aさんと他3人があなたの投稿にいいねしました)
    link = models.CharField(max_length=255, null=True, blank=True)  # 通知クリック時の遷移先
    metadata = models.JSONField(null=True, blank=True)  # 追加情報
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'actor', 'status', 'group_id', 'created_at']),
            models.Index(fields=['content_type', 'object_id']),
        ]
```
