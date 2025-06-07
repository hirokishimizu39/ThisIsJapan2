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
- 型共有には openapi-typescript 等で共通型管理（フェーズ2以降）

### コンポーネント詳細

1. **フロントエンド (Vercel)**

   - Next.js 15.3.1 (App Router)
   - Server Components + Client Components
   - Route Handlers (BFF)
   - SWR によるデータフェッチング
   - shadcn/ui による UI コンポーネント

2. **バックエンド (AWS ECS Fargate)**

   - Django REST Framework(Python3.12, Django5.2, djangorestframework3.16.0, django-cors-headers4.7.0, djangorestframework-simplejwt5.3.1)
   - API バージョニング（v1→v2...）
   - JWT 認証([https://jpadilla.github.io/django-rest-framework-jwt/)](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/))
   - CORS 設定(https://github.com/adamchainz/django-cors-headers?tab=readme-ov-file)
   - カスタム認証ミドルウェア（フェーズ2以降）

3. **データベース (AWS RDS)**

   - PostgreSQL 14
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

- RESTful API 設計原則に従った実装(https://learn.microsoft.com/ja-jp/azure/architecture/best-practices/api-design)
- OpenAPI 3.0 仕様に準拠したドキュメント(https://swagger.io/docs/specification/v3_0/about/)
- バージョニング導入 (`/api/v1/`)
- ビジネスロジックとデータ処理に集中
- JWT 認証によるセキュリティ確保

### フロントエンド API (Next.js Route Handlers)

- Reactによる宣言型プログラミング、コンポーネント指向UIの実装
- バックエンド API の呼び出しとデータ整形
- JWT(認証トークン)の管理と伝達
- Next.jsのパフォーマンス最適化（レンダリング戦略(CSR,SSR,ISR,SSGの使い分け)、キャッシュ）
- エラーハンドリング

## セキュリティ設計

### 認証・認可

1. **JWT ベースの認証**

   - アクセストークン (有効期限: 1 時間)
   - リフレッシュトークン (有効期限: 7 日)
   - HTTPS による通信暗号化

2. **権限管理**
   - IAMロールベースアクセス制御
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
   - SWR(Stale-While-Revalidate) によるクライアントサイドキャッシュ
   - CDN キャッシュ
   - Route Handlers でのデータ集約（複数 API の呼び出しを最適化）

### バックエンド

1. **データベース**

   - インデックス最適化(B-treeアルゴリズム)
   - クエリキャッシュ()
   - N+1 問題の解決()

2. **API 応答**
   - ページネーション()
   - 部分的レスポンス()
   - 圧縮()

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
