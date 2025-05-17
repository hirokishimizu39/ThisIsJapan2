# システム設計書

## システムアーキテクチャ

### 全体構成

```
[Client] → [Vercel] → [Next.js Route Handlers (BFF)] → [Django API] → [PostgreSQL]
                                                                    ↘ [S3]
```

### BFF（Backend for Frontend）アーキテクチャ

Next.js の Route Handlers を BFF として導入し、フロントエンドとバックエンドの責務を明確に分離します。これにより、今後の保守性とスケーラビリティが向上します。

| 項目         | Next.js Route Handlers                                             | Django REST Framework (DRF)                                           |
| ------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 主な役割     | UI 最適化 API（BFF）                                               | DB 操作・業務ロジック API                                             |
| 技術スタック | Next.js / TypeScript                                               | Django / Python                                                       |
| 主な処理内容 | - 認証済みユーザー取得<br>- SWR 用の柔軟 API<br>- 表示用データ整形 | - 認証・ユーザー管理<br>- 投稿/ブックマーク/通知処理<br>- DB 直接操作 |
| データ通信   | クライアント → Route Handlers → DRF                                | DRF → PostgreSQL など                                                 |

#### データフロー詳細

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

### コンポーネント詳細

1. **フロントエンド (Vercel)**

   - Next.js 15.3.1 (App Router)
   - Server Components + Client Components
   - Route Handlers (BFF)
   - SWR によるデータフェッチング
   - shadcn/ui による UI コンポーネント

2. **バックエンド (AWS ECS Fargate)**

   - Django REST Framework
   - API バージョニング（v1 など）
   - JWT 認証
   - CORS 設定
   - カスタム認証ミドルウェア

3. **データベース (AWS RDS)**

   - PostgreSQL 15.x
   - Connection Pooling
   - 自動バックアップ

4. **ストレージ (AWS S3)**

   - 画像ファイルの保存
   - CloudFront による CDN 配信

5. **DNS/SSL (AWS Route53 + ACM)**
   - カスタムドメイン管理
   - SSL 証明書の自動更新

## API 設計

### バックエンド API (Django REST Framework)

- RESTful API 設計原則に従った実装
- OpenAPI 3.0 仕様に準拠したドキュメント
- バージョニング導入 (`/api/v1/`)
- ビジネスロジックとデータ処理に集中
- JWT 認証によるセキュリティ確保

### フロントエンド API (Next.js Route Handlers)

- UI 要件に特化したエンドポイント設計
- バックエンド API の呼び出しとデータ整形
- 認証トークンの管理と伝達
- パフォーマンス最適化（キャッシュ、バッチ処理）
- エラーハンドリングとユーザーフレンドリーなレスポンス

## セキュリティ設計

### 認証・認可

1. **JWT ベースの認証**

   - アクセストークン (有効期限: 1 時間)
   - リフレッシュトークン (有効期限: 7 日)
   - HTTPS による通信暗号化

2. **権限管理**
   - ロールベースアクセス制御
   - API エンドポイントごとの権限チェック

### データ保護

1. **個人情報**

   - パスワードのハッシュ化
   - センシティブデータの暗号化

2. **ファイルアップロード**
   - ファイルタイプの検証
   - サイズ制限
   - マルウェアスキャン

## パフォーマンス最適化

### フロントエンド

1. **画像最適化**

   - next/image による自動最適化
   - WebP 形式の利用
   - レスポンシブ対応

2. **キャッシュ戦略**
   - SWR によるクライアントサイドキャッシュ
   - Stale-While-Revalidate
   - CDN キャッシュ
   - Route Handlers でのデータ集約（複数 API の呼び出しを最適化）

### バックエンド

1. **データベース**

   - インデックス最適化
   - クエリキャッシュ
   - N+1 問題の解決

2. **API 応答**
   - ページネーション
   - 部分的レスポンス
   - 圧縮

## スケーラビリティ

### 水平スケーリング

1. **フロントエンド**

   - Vercel の自動スケーリング
   - エッジキャッシュ

2. **バックエンド**

   - ECS Fargate の自動スケーリング
   - ロードバランシング

3. **データベース**
   - RDS のリードレプリカ
   - コネクションプーリング

## 監視・ロギング

### 監視項目

1. **アプリケーション**

   - エラーレート
   - レスポンスタイム
   - アクティブユーザー数

2. **インフラストラクチャ**
   - CPU とメモリ使用率
   - ディスク使用量
   - ネットワークトラフィック

### ロギング

1. **アプリケーションログ**

   - エラーログ
   - アクセスログ
   - 監査ログ

2. **インフラログ**
   - AWS CloudWatch Logs
   - ECS タスクログ
   - RDS ログ
