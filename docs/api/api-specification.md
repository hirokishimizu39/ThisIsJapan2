# API リソース設計書

## フロントエンド URL 設計

### 認証・ユーザー関連

```
/ - ホームページ
/auth/login - ログインページ
/auth/register - ユーザー登録ページ
/dashboard - ユーザーダッシュボード
/dashboard/photos - ユーザーの写真投稿一覧
/dashboard/words - ユーザーの言葉投稿一覧
/dashboard/likes - ユーザーのいいね一覧
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
```

## バックエンド API エンドポイント設計

### 認証関連

```
POST /api/auth/register - ユーザー登録
POST /api/auth/login - ログイン
POST /api/auth/logout - ログアウト
GET /api/auth/user - 現在のユーザー情報取得
```

### 写真関連

```
GET /api/photos - 写真一覧取得（クエリパラメータでフィルタリング）
GET /api/photos/top - 人気の写真取得
GET /api/photos/{id} - 特定の写真取得
POST /api/photos - 写真投稿
PUT /api/photos/{id} - 写真更新
DELETE /api/photos/{id} - 写真削除
POST /api/photos/{id}/like - 写真にいいね
DELETE /api/photos/{id}/like - いいね取り消し
```

### 言葉関連

```
GET /api/words - 言葉一覧取得（クエリパラメータでフィルタリング）
GET /api/words/top - 人気の言葉取得
GET /api/words/{id} - 特定の言葉取得
POST /api/words - 言葉投稿
PUT /api/words/{id} - 言葉更新
DELETE /api/words/{id} - 言葉削除
POST /api/words/{id}/like - 言葉にいいね
DELETE /api/words/{id}/like - いいね取り消し
```

### 体験関連

```
GET /api/experiences - 体験一覧取得（クエリパラメータでフィルタリング）
GET /api/experiences/top - 人気の体験取得
GET /api/experiences/{id} - 特定の体験取得
POST /api/experiences - 体験投稿
PUT /api/experiences/{id} - 体験更新
DELETE /api/experiences/{id} - 体験削除
POST /api/experiences/{id}/like - 体験にいいね
DELETE /api/experiences/{id}/like - いいね取り消し
```

### ユーザー関連

```
GET /api/users/{id} - ユーザー情報取得
GET /api/users/{id}/photos - ユーザーの写真一覧
GET /api/users/{id}/words - ユーザーの言葉一覧
GET /api/users/{id}/experiences - ユーザーの体験一覧
GET /api/users/{id}/likes - ユーザーのいいね一覧
```

--- 



## 認証 API

### ユーザー登録

```
POST /api/auth/register
Content-Type: application/json

Request:
{
    "username": "string",
    "password": "string",
    "is_japanese": boolean
}

Response: 201 Created
{
    "id": integer,
    "username": "string",
    "is_japanese": boolean,
    "created_at": "datetime"
}
```

### ログイン

```
POST /api/auth/login
Content-Type: application/json

Request:
{
    "username": "string",
    "password": "string"
}

Response: 200 OK
{
    "access_token": "string",
    "refresh_token": "string",
    "user": {
        "id": integer,
        "username": "string",
        "is_japanese": boolean
    }
}
```

### ログアウト

```
POST /api/auth/logout
Authorization: Bearer <access_token>

Response: 204 No Content
```

## 写真 API

### 写真一覧取得

```
GET /api/photos
Authorization: Bearer <access_token>
Query Parameters:
- page: integer (default: 1)
- per_page: integer (default: 20)
- sort: string (options: "latest", "popular")

Response: 200 OK
{
    "items": [
        {
            "id": integer,
            "title": "string",
            "description": "string",
            "image_url": "string",
            "user": {
                "id": integer,
                "username": "string"
            },
            "likes": integer,
            "created_at": "datetime"
        }
    ],
    "total": integer,
    "page": integer,
    "per_page": integer
}
```

### 写真投稿

```
POST /api/photos
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Request:
- title: string
- description: string
- image: file

Response: 201 Created
{
    "id": integer,
    "title": "string",
    "description": "string",
    "image_url": "string",
    "user": {
        "id": integer,
        "username": "string"
    },
    "likes": 0,
    "created_at": "datetime"
}
```

## 言葉 API

### 言葉一覧取得

```
GET /api/words
Authorization: Bearer <access_token>
Query Parameters:
- page: integer (default: 1)
- per_page: integer (default: 20)
- sort: string (options: "latest", "popular")

Response: 200 OK
{
    "items": [
        {
            "id": integer,
            "original": "string",
            "translation": "string",
            "description": "string",
            "user": {
                "id": integer,
                "username": "string"
            },
            "likes": integer,
            "created_at": "datetime"
        }
    ],
    "total": integer,
    "page": integer,
    "per_page": integer
}
```

### 言葉投稿

```
POST /api/words
Authorization: Bearer <access_token>
Content-Type: application/json

Request:
{
    "original": "string",
    "translation": "string",
    "description": "string"
}

Response: 201 Created
{
    "id": integer,
    "original": "string",
    "translation": "string",
    "description": "string",
    "user": {
        "id": integer,
        "username": "string"
    },
    "likes": 0,
    "created_at": "datetime"
}
```

## 体験 API

### 体験一覧取得

```
GET /api/experiences
Authorization: Bearer <access_token>
Query Parameters:
- page: integer (default: 1)
- per_page: integer (default: 20)
- sort: string (options: "latest", "popular")
- location: string (optional)

Response: 200 OK
{
    "items": [
        {
            "id": integer,
            "title": "string",
            "description": "string",
            "image_url": "string",
            "location": "string",
            "user": {
                "id": integer,
                "username": "string"
            },
            "likes": integer,
            "created_at": "datetime"
        }
    ],
    "total": integer,
    "page": integer,
    "per_page": integer
}
```

### 体験投稿

```
POST /api/experiences
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Request:
- title: string
- description: string
- image: file
- location: string

Response: 201 Created
{
    "id": integer,
    "title": "string",
    "description": "string",
    "image_url": "string",
    "location": "string",
    "user": {
        "id": integer,
        "username": "string"
    },
    "likes": 0,
    "created_at": "datetime"
}
```

## いいね API

### いいね追加

```
POST /api/likes
Authorization: Bearer <access_token>
Content-Type: application/json

Request:
{
    "content_type": "string", // "photo", "word", "experience"
    "object_id": integer
}

Response: 201 Created
{
    "id": integer,
    "content_type": "string",
    "object_id": integer,
    "user": {
        "id": integer,
        "username": "string"
    }
}
```

### いいね削除

```
DELETE /api/likes/{content_type}/{object_id}
Authorization: Bearer <access_token>

Response: 204 No Content
```

## エラーレスポンス

### 400 Bad Request

```
{
    "error": "string",
    "message": "string",
    "details": {
        "field_name": [
            "error_message"
        ]
    }
}
```

### 401 Unauthorized

```
{
    "error": "string",
    "message": "string"
}
```

### 403 Forbidden

```
{
    "error": "string",
    "message": "string"
}
```

### 404 Not Found

```
{
    "error": "string",
    "message": "string"
}
```

### 500 Internal Server Error

```
{
    "error": "string",
    "message": "string"
}
```
