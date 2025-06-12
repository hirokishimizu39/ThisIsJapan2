# 技術スタック詳細

## フロントエンド

### コア技術

- **Next.js 15.3.1**

  - App Router によるファイルベースルーティング
  - Server Components と Client Components の使い分け
  - Route Handlers による BFF（Backend for Frontend）実装

- **TypeScript**
  - 型安全性の確保
  - 開発効率の向上
  - コード品質の維持
  - API 型定義（OpenAPI 連携）

### UI/UX ライブラリ

- **TailwindCSS**

  - ユーティリティファーストの CSS
  - カスタマイズ可能なデザインシステム
  - 高いパフォーマンス

- **shadcn/ui**
  - 再利用可能な UI コンポーネント
  - Radix UI ベース
  - アクセシビリティ対応

### 状態管理/データフェッチング

- **SWR**
  - リアルタイムデータフェッチング
  - キャッシュ管理
  - 自動再検証
  - BFF 経由のデータ取得最適化

## BFF（Backend for Frontend）

### コア技術

- **Next.js Route Handlers**
  - API Routes 進化版（App Router 対応）
  - サーバーサイドでのリクエスト処理
  - フロントエンド最適化 API
  - リクエスト/レスポンス変換

### メリット

- **UI 最適化**

  - フロントエンド要件に合わせた API デザイン
  - 複数のバックエンド API を一回のリクエストに集約

- **認証管理**

  - トークン管理の一元化
  - バックエンドへの安全な認証情報受け渡し

- **データ整形**

  - レスポンスの正規化
  - 多言語対応や表示形式の調整

- **型安全性**
  - OpenAPI スキーマから TypeScript 型を生成
  - フロントエンド-バックエンド間の型の一貫性

## バックエンド

### コア技術

- **Django REST Framework**

  - RESTful API 開発
  - 認証・認可システム
  - シリアライザによるデータ変換
  - API バージョニング（v1 など）

- **PostgreSQL**
  - リレーショナルデータベース
  - JSON 型サポート
  - 全文検索機能

### 認証システム

- **JWT 認証**
  - ステートレスな認証
  - アクセストークン
  - リフレッシュトークン
  - BFF を経由した安全なトークン管理

### ファイルストレージ

- **AWS S3**
  - 画像ファイルの保存
  - CloudFront による CDN 配信
  - バケットポリシーによるアクセス制御

## インフラストラクチャ

### クラウドプラットフォーム

- **Vercel**

  - フロントエンド（Next.js）のホスティング
  - 自動デプロイメント
  - エッジキャッシュ
  - Serverless Functions（Route Handlers 実行環境）

- **AWS**
  - ECS (Fargate)
  - RDS (PostgreSQL)
  - S3 + CloudFront
  - Route53 + ACM

### CI/CD

- **GitHub Actions**
  - 自動テスト
  - コード品質チェック
  - 自動デプロイ

### モニタリング

- **AWS CloudWatch**
  - ログ管理
  - メトリクス監視
  - アラート設定

## 開発ツール

### コード品質

- **ESLint**

  - TypeScript/JavaScript のリント
  - コーディング規約の強制
  - 自動修正

- **Prettier**

  - コードフォーマット
  - 一貫性のある整形
  - エディタ統合

- **Black**
  - Python コードフォーマット
  - 一貫性のある整形
  - CI/CD 統合

### テスト

- **Jest**

  - ユニットテスト
  - スナップショットテスト
  - カバレッジレポート

- **Cypress**

  - E2E テスト
  - コンポーネントテスト
  - ビジュアルリグレッション

- **pytest**
  - Python ユニットテスト
  - フィクスチャ
  - パラメータ化テスト

## パッケージマネージャー

- **npm**

  - 依存関係管理
  - スクリプト実行
  - パッケージロック

- **pip**
  - Python 依存関係管理
  - 仮想環境統合
  - requirements.txt 管理

## バージョン管理

- [**Git**](https://git-scm.com/docs)
  - ブランチ戦略
  - コミットメッセージ規約
  - プルリクエストフロー
