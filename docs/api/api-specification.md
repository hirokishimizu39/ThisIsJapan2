# API リソース設計書

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

## バックエンド API エンドポイント設計

### 認証関連

```
POST /api/auth/register - ユーザー登録（言語関連情報を含む）
POST /api/auth/login - ログイン
POST /api/auth/logout - ログアウト
GET /api/auth/user - 現在のユーザー情報取得
```

### 写真関連

```
GET /api/photos - 写真一覧取得（クエリパラメータでフィルタリング）
GET /api/photos/popular - 人気の写真取得
GET /api/photos/{id} - 特定の写真取得
POST /api/photos - 写真投稿
PUT /api/photos/{id} - 写真更新
DELETE /api/photos/{id} - 写真削除
POST /api/photos/{id}/like - 写真にいいね
DELETE /api/photos/{id}/like - いいね取り消し
POST /api/photos/{id}/bookmark - 写真をブックマーク
DELETE /api/photos/{id}/bookmark - ブックマーク取り消し
GET /api/photos/{id}/comments - コメント一覧取得
POST /api/photos/{id}/comments - コメント投稿
GET /api/photos/{id}/tags - タグ一覧取得
POST /api/photos/{id}/tags - タグ追加
DELETE /api/photos/{id}/tags/{tag_id} - タグ削除
```

### 言葉関連

```
GET /api/words - 言葉一覧取得（クエリパラメータでフィルタリング）
GET /api/words/popular - 人気の言葉取得
GET /api/words/{id} - 特定の言葉取得
POST /api/words - 言葉投稿
PUT /api/words/{id} - 言葉更新
DELETE /api/words/{id} - 言葉削除
POST /api/words/{id}/like - 言葉にいいね
DELETE /api/words/{id}/like - いいね取り消し
POST /api/words/{id}/bookmark - 言葉をブックマーク
DELETE /api/words/{id}/bookmark - ブックマーク取り消し
GET /api/words/{id}/comments - コメント一覧取得
POST /api/words/{id}/comments - コメント投稿
GET /api/words/{id}/tags - タグ一覧取得
POST /api/words/{id}/tags - タグ追加
DELETE /api/words/{id}/tags/{tag_id} - タグ削除
```

### 体験関連

```
GET /api/experiences - 体験一覧取得（クエリパラメータでフィルタリング）
GET /api/experiences/popular - 人気の体験取得
GET /api/experiences/{id} - 特定の体験取得
POST /api/experiences - 体験投稿
PUT /api/experiences/{id} - 体験更新
DELETE /api/experiences/{id} - 体験削除
POST /api/experiences/{id}/like - 体験にいいね
DELETE /api/experiences/{id}/like - いいね取り消し
POST /api/experiences/{id}/bookmark - 体験をブックマーク
DELETE /api/experiences/{id}/bookmark - ブックマーク取り消し
GET /api/experiences/{id}/comments - コメント一覧取得
POST /api/experiences/{id}/comments - コメント投稿
GET /api/experiences/{id}/tags - タグ一覧取得
POST /api/experiences/{id}/tags - タグ追加
DELETE /api/experiences/{id}/tags/{tag_id} - タグ削除
```

### コメント関連（共通）

```
DELETE /api/comments/{comment_id} - コメント削除
```

### いいね関連（共通）

```
POST /api/likes - いいね追加（Generic Foreign Key対応）
DELETE /api/likes/{content_type}/{object_id} - いいね削除
```

### ブックマーク関連（共通）

```
POST /api/bookmarks - ブックマーク追加（Generic Foreign Key対応）
DELETE /api/bookmarks/{content_type}/{object_id} - ブックマーク削除
```

### タグ関連（共通）

```
GET /api/tags - タグ一覧取得
```

### 通知関連

```
GET /api/notifications - 通知一覧取得
POST /api/notifications - 通知作成（システム通知用）
PUT /api/notifications/{id} - 通知更新
GET /api/notifications/{id} - 特定の通知取得
PUT /api/notifications/{id}/read - 通知を既読に
PUT /api/notifications/read-all - すべての通知を既読に
DELETE /api/notifications/{id} - 通知削除
```

### ユーザー関連

```
GET /api/user/{id} - ユーザー情報取得
GET /api/user/{id}/photos - ユーザーの写真一覧
GET /api/user/{id}/words - ユーザーの言葉一覧
GET /api/user/{id}/experiences - ユーザーの体験一覧
GET /api/user/{id}/likes - ユーザーのいいね一覧
GET /api/user/{id}/bookmarks - ユーザーのブックマーク一覧
PUT /api/user/{id} - プロフィール更新（言語情報を含む）
```

## API リクエスト/レスポンス構造例

### ユーザー登録

**リクエスト**

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

**リクエスト**

```json
POST /api/photos/1/comments
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

### いいね追加（Generic Foreign Key 使用）

**リクエスト**

```json
POST /api/likes
{
  "content_type": "photo",
  "object_id": 1
}
```

**レスポンス**

```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "tanaka_jp"
  },
  "content_type": "photo",
  "object_id": 1,
  "created_at": "2023-06-01T14:23:45Z",
  "updated_at": "2023-06-01T14:23:45Z"
}
```

### ブックマーク追加（Generic Foreign Key 使用）

**リクエスト**

```json
POST /api/bookmarks
{
  "content_type": "experience",
  "object_id": 2
}
```

**レスポンス**

```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "tanaka_jp"
  },
  "content_type": "experience",
  "object_id": 2,
  "created_at": "2023-06-01T15:10:22Z",
  "updated_at": "2023-06-01T15:10:22Z"
}
```

### 通知一覧取得

**リクエスト**

```
GET /api/notifications?status=unread&limit=10&offset=0
```

**レスポンス**

```json
{
  "count": 25,
  "next": "/api/notifications?status=unread&limit=10&offset=10",
  "previous": null,
  "results": [
    {
      "id": 1,
      "recipient": {
        "id": 1,
        "username": "tanaka_jp"
      },
      "actor": {
        "id": 2,
        "username": "smith_en"
      },
      "action_type": "like",
      "content_type": "photo",
      "object_id": 5,
      "message": "smith_enさんがあなたの写真にいいねしました",
      "status": "unread",
      "group_id": "photo_5_likes",
      "link": "/photos/5",
      "metadata": {
        "photo_title": "東京の夜景"
      },
      "created_at": "2023-06-02T09:15:30Z",
      "updated_at": "2023-06-02T09:15:30Z"
    }
    // 他の通知...
  ]
}
```

### 通知作成（システム通知用）

**リクエスト**

```json
POST /api/notifications
{
  "recipient_id": 1,
  "action_type": "system",
  "message": "システムメンテナンスのお知らせ",
  "link": "/announcements/maintenance",
  "metadata": {
    "maintenance_date": "2023-06-10T22:00:00Z",
    "duration": "2時間"
  }
}
```

**レスポンス**

```json
{
  "id": 10,
  "recipient": {
    "id": 1,
    "username": "tanaka_jp"
  },
  "actor": null,
  "action_type": "system",
  "content_type": null,
  "object_id": null,
  "message": "システムメンテナンスのお知らせ",
  "status": "unread",
  "group_id": null,
  "link": "/announcements/maintenance",
  "metadata": {
    "maintenance_date": "2023-06-10T22:00:00Z",
    "duration": "2時間"
  },
  "created_at": "2023-06-05T10:30:00Z",
  "updated_at": "2023-06-05T10:30:00Z"
}
```

### 通知を既読に

**リクエスト**

```
PUT /api/notifications/1/read
```

**レスポンス**

```json
{
  "id": 1,
  "status": "read",
  "updated_at": "2023-06-02T10:45:22Z"
}
```

### すべての通知を既読に

**リクエスト**

```
PUT /api/notifications/read-all
```

**レスポンス**

```json
{
  "message": "すべての通知を既読にしました",
  "count": 15,
  "updated_at": "2023-06-02T11:30:45Z"
}
```

## OpenAPI 3.0 仕様

API の詳細な仕様は、OpenAPI 3.0 フォーマットで`docs/api/openapi.yaml`に定義されています。このドキュメントには以下の情報が含まれています：

- API 全体の基本情報（タイトル、説明、バージョン）
- 利用可能なサーバー環境の定義
- 認証方式（JWT Bearer 認証）
- データモデルのスキーマ定義
- 全 API エンドポイントの詳細（パス、メソッド、パラメータ、リクエスト/レスポンス形式）

### Swagger UI による閲覧

Django REST Framework の設定により、API ドキュメントは以下の URL で閲覧できます：

- 開発環境: `http://localhost:8000/api/docs/`
- 本番環境: `https://api.thisisjapan.example.com/api/docs/`

### OpenAPI 仕様の活用方法

OpenAPI 仕様は以下のような用途に活用できます：

1. **API 仕様の視覚的な確認**：Swagger UI で各エンドポイントの詳細を確認
2. **クライアントコードの自動生成**：OpenAPI Generator 等のツールを使用
3. **テストの自動化**：Postman などのツールでコレクションをインポート
4. **API 仕様の文書化**：開発者間での仕様共有

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
