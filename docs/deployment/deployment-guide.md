# This is Japan - デプロイメントガイド

このドキュメントでは、This is Japan アプリケーションを本番環境にデプロイする手順を説明します。

## デプロイメントアーキテクチャ

This is Japan は、以下のコンポーネントで構成されています：

- **フロントエンド**: Next.js（Vercel でホスティング）
- **バックエンド**: Django REST Framework（AWS ECS Fargate でホスティング）
- **データベース**: PostgreSQL（AWS RDS でホスティング）
- **ストレージ**: AWS S3（メディアファイル用）
- **DNS**: AWS Route53

![アーキテクチャ図](../architecture/images/deployment-architecture.png)

## 前提条件

デプロイを開始する前に、以下のアカウントとツールが必要です：

- AWS アカウント
- Vercel アカウント
- AWS コマンドラインインターフェース（CLI）
- Terraform（インフラストラクチャ管理用）

## 1. バックエンドデプロイ（AWS）

### 1.1 AWS CLI の設定

```bash
aws configure
```

プロンプトに従って、AWS アクセスキー、シークレットキー、リージョンなどを入力します。

### 1.2 Terraform 環境変数の設定

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvarsを編集して必要な変数を設定
```

### 1.3 インフラストラクチャのプロビジョニング

```bash
terraform init
terraform plan
terraform apply
```

これにより、以下のリソースが作成されます：

- VPC、サブネット、セキュリティグループなどのネットワークインフラ
- ECS クラスターとサービス
- RDS データベースインスタンス
- S3 バケット
- CloudWatch ロググループ

### 1.4 バックエンドのビルドとデプロイ

```bash
cd backend
docker build -t thisisjapan-backend:latest .
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
docker tag thisisjapan-backend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/thisisjapan-backend:latest
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/thisisjapan-backend:latest
```

### 1.5 ECS サービスの更新

```bash
aws ecs update-service --cluster thisisjapan-cluster --service thisisjapan-backend --force-new-deployment
```

## 2. フロントエンドデプロイ（Vercel）

### 2.1 Vercel CLI のインストールとログイン

```bash
npm install -g vercel
vercel login
```

### 2.2 環境変数の設定

Vercel ダッシュボードでプロジェクトを作成し、以下の環境変数を設定します：

- `NEXT_PUBLIC_API_URL`: バックエンド API の URL
- `NEXTAUTH_URL`: フロントエンドの URL
- `NEXTAUTH_SECRET`: JWT シークレット

### 2.3 デプロイ

```bash
cd frontend
vercel
```

本番環境の場合：

```bash
vercel --prod
```

## 3. DNS 設定（AWS Route53）

1. Route53 で新しいホストゾーンを作成
2. ドメインのネームサーバーを Route53 のネームサーバーに更新
3. バックエンドとフロントエンドのサブドメインレコードを作成
   - `api.yourdomain.com` → バックエンドのロードバランサー DNS
   - `www.yourdomain.com` → Vercel の CNAME

## 4. SSL 証明書設定

### 4.1 AWS Certificate Manager（バックエンド用）

1. ACM で証明書をリクエスト
2. Route53 でドメイン所有権を検証
3. ALB に SSL 証明書をアタッチ

### 4.2 Vercel SSL（フロントエンド用）

Vercel は自動的に SSL 証明書を管理します。カスタムドメインを設定するだけで有効になります。

## 5. データベースマイグレーション

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## 6. 静的ファイルとメディアファイルの管理

### 6.1 S3 バケット設定

```bash
aws s3 mb s3://thisisjapan-media
aws s3 mb s3://thisisjapan-static
```

### 6.2 静的ファイルのアップロード

```bash
python manage.py collectstatic
aws s3 sync staticfiles/ s3://thisisjapan-static/
```

## 7. CI/CD パイプライン（GitHub Actions）

`.github/workflows/`ディレクトリにワークフローを設定します。

### 7.1 バックエンド CI/CD

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths:
      - "backend/**"

jobs:
  test:
    # テスト実行の設定

  deploy:
    # AWSへのデプロイ設定
```

### 7.2 フロントエンド CI/CD

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths:
      - "frontend/**"

jobs:
  deploy:
    # Vercelへのデプロイ設定
```

## 8. 監視とロギング

### 8.1 CloudWatch の設定

1. CloudWatch ダッシュボードの作成
2. アラームの設定（CPU 使用率、メモリ使用率、エラーレートなど）

### 8.2 ロギング

バックエンドとフロントエンドの両方でログを設定します。

## 9. バックアップとリカバリー

### 9.1 RDS バックアップ

自動バックアップスケジュールを設定します。

### 9.2 S3 バケットのバージョニング

S3 バケットでバージョニングを有効にします。

## トラブルシューティング

### デプロイメント問題

- ECS タスク定義を確認
- CloudWatch ログを確認
- セキュリティグループとネットワーク ACL を確認

### データベース接続問題

- RDS セキュリティグループ設定を確認
- データベース接続文字列を確認

### API アクセス問題

- CORS の設定を確認
- API Gateway の設定を確認

## セキュリティベストプラクティス

- 環境変数を AWS Secrets Manager で管理
- IAM ロールとポリシーの最小権限原則
- セキュリティグループの適切な設定
- WAF を使用した API の保護

## 定期的なメンテナンス

- セキュリティアップデートの適用
- データベースインデックスの最適化
- パフォーマンスモニタリングとチューニング

## 本番環境確認チェックリスト

- [ ] フロントエンドとバックエンドの接続テスト
- [ ] ユーザー登録とログインフロー
- [ ] コンテンツのアップロードとダウンロード
- [ ] サーバーパフォーマンステスト
- [ ] セキュリティスキャン
- [ ] モバイル互換性テスト
