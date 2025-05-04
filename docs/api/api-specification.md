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

# UX向上
/tags - タグ一覧ページ
/notifications - 通知一覧ページ  
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
GET /api/photos/{id}/comments - コメント一覧取得
POST /api/photos/{id}/comments - コメント投稿
GET /api/photos/{id}/tags - タグ一覧取得    
POST /api/photos/{id}/tags - タグ追加
DELETE /api/photos/{id}/tags/{tag_id} - タグ削除
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
GET /api/words/{id}/comments - コメント一覧取得
POST /api/words/{id}/comments - コメント投稿
GET /api/words/{id}/tags - タグ一覧取得
POST /api/words/{id}/tags - タグ追加
DELETE /api/words/{id}/tags/{tag_id} - タグ削除
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

# タグ関連（共通）

```
GET /api/tags - タグ一覧取得
```

### 通知関連

```
GET /api/notifications - 通知一覧取得
PUT /api/notifications/{id}/read - 通知を既読に
DELETE /api/notifications/{id} - 通知削除（任意）
```

### ユーザー関連

```
GET /api/users/{id} - ユーザー情報取得
GET /api/users/{id}/photos - ユーザーの写真一覧
GET /api/users/{id}/words - ユーザーの言葉一覧
GET /api/users/{id}/experiences - ユーザーの体験一覧
GET /api/users/{id}/likes - ユーザーのいいね一覧
PUT /api/users/{id} - プロフィール更新
```

