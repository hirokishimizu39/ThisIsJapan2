# This is Japan - デプロイメントガイド

このドキュメントでは、AWS 初心者でも**マネジメントコンソール**を使って、This is Japan アプリケーションを本番環境にデプロイする手順を説明します。

## デプロイメントアーキテクチャ

This is Japan は、以下の**シンプルな構成**でデプロイします：

### ファイル配信の分離設計

**Vercel**: Next.js アプリケーション + ビルド時静的ファイル  
**S3 + CloudFront**: ユーザーアップロード画像 + Django 管理画面ファイル

### 全体構成

```
フロントエンド: [ユーザー] → [Vercel CDN] → [Next.js App]
                                    ↓ API通信
バックエンド:   [ユーザー] → [Route53] → [ALB] → [ECS統合タスク] → [RDS PostgreSQL]
                                                 (Nginx+Django)  ↘ [S3統合バケット]
静的ファイル:   [ユーザー] → [CloudFront CDN] ← [S3統合バケット]
```

### 主要コンポーネント

- **フロントエンド**: Next.js 15 (Vercel でホスティング)
- **バックエンド**: 統合 ECS タスク (Nginx + Django + Gunicorn - 1 タスクから開始)
- **データベース**: PostgreSQL (RDS t3.micro - Single-AZ)
- **ストレージ**: S3 統合バケット (media/ + static/(Django 静的ファイル を 1 つのバケットで管理))
- **CDN**: CloudFront (S3 の静的ファイル配信・画像最適化) + Vercel CDN (Next.js 配信)
- **DNS**: Route53 + ACM SSL 証明書
- **管理**: Session Manager (Bastion 不要のセキュアアクセス)

![アーキテクチャ図](aws-architecture.md)

## 💰 予想コスト (MVP 段階)

```
月額概算:
├── ALB: $16/月
├── ECS Fargate: $8/月 (1タスク)
├── RDS t3.micro: $13/月
├── NAT Gateway: $32/月 (基本料金)
├── NAT Data Processing: $3/月
├── S3 + CloudFront: $3/月
├── Route53: $0.5/月
├── Secrets Manager: $1/月
└── CloudWatch: $2/月
────────────────────────
合計: 約$78/月 (約11,000円/月)
```

**注意**: NAT ゲートウェイが最大のコスト要因ですが、プライベートサブネットの ECS がインターネットアクセスするために必須です。

## 📋 事前準備

### 必要なアカウント・ツール

- AWS アカウント (無料利用枠推奨)
- Vercel アカウント
- ドメイン名 (例: thisisjapan.com)
- Docker Desktop (ローカルでのイメージビルド用)

### 環境変数の準備

#### 1. 開発環境での.env ファイル作成

```bash
# バックエンド環境変数
cp backend/env.example backend/.env

# フロントエンド環境変数
cp frontend/env.example frontend/.env.local
```

#### 2. 開発環境用の設定値

**backend/.env** (開発用):

```bash
# Django Settings
DEBUG=1
SECRET_KEY=dev_secret_key_for_development_only
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# Database Configuration
DATABASE_URL=postgres://postgres:postgres@db:5432/thisisjapan

# AWS Settings (開発環境では無効化)
AWS_STORAGE_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-northeast-1

# JWT Settings
JWT_SECRET=dev_jwt_secret_key_for_development

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**frontend/.env.local** (開発用):

```bash
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_nextauth_secret_for_development

# Application Environment
NODE_ENV=development
```

#### 3. 本番環境用の値を事前決定

以下の値を事前に決めておいてください：

```bash
# 本番環境設定値
DOMAIN_NAME=thisisjapan.com
DB_PASSWORD=TIJ_2024@Prod!Ver1  # 12文字以上の強固なパスワード
SECRET_KEY=django_prod_secret_key_2024_secure  # 50文字以上推奨
JWT_SECRET=jwt_prod_secret_key_2024_secure
NEXTAUTH_SECRET=nextauth_prod_secret_2024_secure

# AWS設定
AWS_REGION=ap-northeast-1
BUCKET_NAME=thisisjapan-files
```

#### 4. 環境変数生成ツール

**強固なシークレットキー生成方法**:

```bash
# Django SECRET_KEY生成
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
# オンラインツール使用(Django SECRET_KEY)
https://djecrety.ir/

# ランダム文字列生成（JWT用など）
openssl rand -base64 32

```

## 🚀 Phase 1: AWS 基盤構築 (1 日)

### 1-1. VPC 作成

**AWS マネジメントコンソール > VPC**

1. **VPC 作成**

   ```
   名前タグ: thisisjapan-vpc
   IPv4 CIDR: 10.0.0.0/16
   IPv6 CIDR: なし
   テナンシー: デフォルト
   ```

2. **サブネット作成**

   **パブリックサブネット:**

   ```
   名前: thisisjapan-public-subnet
   VPC: thisisjapan-vpc
   アベイラビリティーゾーン: ap-northeast-1a
   IPv4 CIDR: 10.0.1.0/24
   ```

   **プライベートサブネット:**

   ```
   名前: thisisjapan-private-subnet
   VPC: thisisjapan-vpc
   アベイラビリティーゾーン: ap-northeast-1a
   IPv4 CIDR: 10.0.2.0/24
   ```

3. **インターネットゲートウェイ作成**

   ```
   名前: thisisjapan-igw
   VPCにアタッチ: thisisjapan-vpc
   ```

4. **NAT ゲートウェイ作成**

   ```
   名前: thisisjapan-nat-gw
   サブネット: thisisjapan-public-subnet
   接続タイプ: パブリック
   Elastic IP: 新規作成(NAT-GW削除時に自動で削除されないため消し忘れ注意)
   ```

5. **ルートテーブル設定**

   **パブリック用:**

   ```
   名前: thisisjapan-public-rt
   ルート追加: 0.0.0.0/0 → thisisjapan-igw
   サブネット関連付け: thisisjapan-public-subnet
   ```

   **プライベート用:**

   ```
   名前: thisisjapan-private-rt
   ルート追加: 0.0.0.0/0 → thisisjapan-nat-gw
   サブネット関連付け: thisisjapan-private-subnet
   ```

### 1-2. セキュリティグループ作成

**AWS マネジメントコンソール > EC2 > セキュリティグループ**

1. **ALB 用セキュリティグループ**

   ```
   名前: thisisjapan-alb-sg
   説明: for ALB - allow HTTPS/HTTP from internet
   VPC: thisisjapan-vpc

   インバウンドルール:
   - HTTPS (443) | 0.0.0.0/0 | allow HTTPS from anywhere for production site access
   - HTTP (80) | 0.0.0.0/0 | redirect HTTP to HTTPS

   アウトバウンドルール:
   - All traffic | 0.0.0.0/0 | forward to ECS containers and health checks
   ```

   **セキュリティポイント**: インターネットに公開される唯一の入り口。HTTPS 通信で暗号化される。

2. **ECS 用セキュリティグループ**

   ```
   名前: thisisjapan-ecs-sg
   説明: for ECS Fargate Container - allow traffic from ALB only
   VPC: thisisjapan-vpc

   インバウンドルール:
   - HTTP (80) | Source: thisisjapan-alb-sg | allow access from ALB only via Nginx
   - Note: No direct internet access, ALB traffic only

   アウトバウンドルール:
   - HTTPS (443) | 0.0.0.0/0 | access to ECR, Secrets Manager, S3
   - HTTP (80) | 0.0.0.0/0 | for package updates and external API connections
   - PostgreSQL (5432) | thisisjapan-rds-sg | connect RDS database
   ```

   **セキュリティポイント**: プライベートサブネットに配置、ALB からのみアクセス可能。

3. **RDS 用セキュリティグループ**

   ```
   名前: thisisjapan-rds-sg
   説明: PostgreSQL Database - allow DB connections from ECS only
   VPC: thisisjapan-vpc

   インバウンドルール:
   - PostgreSQL (5432) | Source: thisisjapan-ecs-sg | allow DB connections from ECS only
   - Note: Application server access only, no direct connections

   アウトバウンドルール:
   - None (disabled by default) | Database requires no external communication
   ```

   **セキュリティポイント**: 最もセキュアな設定。ECS からのみアクセス、外部からは完全に遮断。

### セキュリティグループの階層設計

```
インターネット → ALB-SG → ECS-SG → RDS-SG
     ↓           ↓        ↓         ↓
   全世界      HTTPS/HTTP  HTTP(80)  PostgreSQL
             からアクセス  ALBのみ   ECSのみ
```

**重要**: 各層で必要最小限のアクセスのみ許可する「多層防御」の考え方

### セキュリティ強化オプション（MVP 後の改善）

上記の設定にて**動作確認を優先する初期構成**です。本番運用では以下の段階的強化を実施：

**Phase 1: 基本動作確認** (上記設定)

- まずアプリケーションが正常動作することを確認

**Phase 2: アウトバウンドルール厳格化**

```
ECS-SG アウトバウンドを以下に変更:
- HTTPS (443) | ECR: 602401143452.dkr.ecr.ap-northeast-1.amazonaws.com | Docker image pull
- HTTPS (443) | Secrets Manager: secretsmanager.ap-northeast-1.amazonaws.com | Get secrets
- HTTPS (443) | S3: s3.ap-northeast-1.amazonaws.com | File upload/download
- PostgreSQL (5432) | RDS-SG | Database connection
```

**Phase 3: Web ACL 追加** (高度)

- AWS WAF で ALB を保護
- 地理的制限・レート制限の実装


### 1-3. VPC エンドポイント作成 (S3 用)

**AWS マネジメントコンソール > VPC > エンドポイント**

```
エンドポイント名: thisisjapan-s3-endpoint
サービス名: com.amazonaws.ap-northeast-1.s3
タイプ: Gateway
VPC: thisisjapan-vpc
ルートテーブル: thisisjapan-private-rt を選択
```

## 🗄️ Phase 2: データベース・ストレージ構築 (半日)

### 2-1. RDS PostgreSQL 作成

**AWS マネジメントコンソール > RDS**

1. **データベース作成**

   ```
   作成方法: 標準作成
   エンジン: PostgreSQL
   バージョン: 14.13 (最新)
   テンプレート: 無料利用枠

   DBインスタンス識別子: thisisjapan-db
   マスターユーザー名: postgres
   マスターパスワード: [事前準備したDB_PASSWORD]
   ```

2. **インスタンス設定**

   ```
   DBインスタンスクラス: db.t3.micro
   ストレージタイプ: 汎用SSD(gp2)
   割り当てストレージ: 20GB
   ストレージ自動スケーリング: 有効
   ```

3. **接続設定**

   ```
   Virtual Private Cloud: thisisjapan-vpc
   サブネットグループ: 新規作成
   パブリックアクセス: いいえ
   VPCセキュリティグループ: thisisjapan-rds-sg
   アベイラビリティーゾーン: ap-northeast-1a
   ```

4. **追加設定**
   ```
   初期データベース名: thisisjapan
   自動バックアップ: 7日間
   監視: 拡張モニタリング無効 (MVP段階)
   ログエクスポート: postgresql ログにチェック
   ```

### 2-2. S3 統合バケット作成

**AWS マネジメントコンソール > S3**

1. **統合バケット作成**

   ```
   バケット名: thisisjapan-files
   AWSリージョン: アジアパシフィック(東京) ap-northeast-1
   ```

2. **設定**

   ```
   オブジェクト所有権: ACL無効
   パブリックアクセスをすべてブロック: チェック外す
   バケットのバージョニング: 無効 (MVP段階)
   ```

3. **フォルダ構造作成**
   バケット内で以下のフォルダを作成：

   ```
   thisisjapan-files/
   ├── media/     # ユーザーアップロード画像
   └── static/    # Django管理画面・REST Framework用CSS/JS
   ```

   **重要**:

   - フロントエンド（Next.js）の静的ファイルは Vercel から配信されるため、この S3 には保存されない
   - ユーザーアップロード画像（media/）は Vercel では配信できないため、S3 + CloudFront が必要

4. **バケットポリシー設定**
   バケット > アクセス許可 > バケットポリシー:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadMediaFiles",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::thisisjapan-files/media/*"
       },
       {
         "Sid": "PublicReadStaticFiles",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::thisisjapan-files/static/*"
       }
     ]
   }
   ```

5. **CORS 設定**
   バケット > アクセス許可 > クロスオリジンリソース共有 (CORS):
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

### 2-3. Secrets Manager 設定

**AWS マネジメントコンソール > Secrets Manager**

1. **データベース認証情報**

   ```
   シークレットタイプ: Amazon RDS データベースの認証情報
   ユーザー名: postgres
   パスワード: [DB_PASSWORD]
   データベース: thisisjapan-db を選択
   シークレット名: thisisjapan/database
   ```

2. **アプリケーション設定**
   ```
   シークレットタイプ: その他のシークレットタイプ
   キー/値:
   - SECRET_KEY: [SECRET_KEY]
   - JWT_SECRET: [JWT_SECRET]
   シークレット名: thisisjapan/app-config
   ```

## 🐳 Phase 3: コンテナ・アプリケーション構築 (1 日)

### 3-1. ECR リポジトリ作成

**AWS マネジメントコンソール > ECR**

```
可視性の設定: プライベート
リポジトリ名: thisisjapan-backend
イメージスキャンの設定: 無効 (MVP段階)
```

### 3-2. 統合 Docker イメージの準備

**Nginx + Django 統合構成の Dockerfile を作成**

1. **統合 Dockerfile 作成** (backend/Dockerfile)

   ```dockerfile
   FROM python:3.11-slim

   # Nginx とシステム依存関係のインストール
   RUN apt-get update && apt-get install -y \
       nginx \
       gcc \
       && rm -rf /var/lib/apt/lists/*

   # Pythonパッケージインストール
   COPY requirements.txt /app/
   RUN pip install --no-cache-dir -r /app/requirements.txt

   # アプリケーションコピー
   COPY . /app/
   WORKDIR /app

   # Nginx設定
   COPY nginx.conf /etc/nginx/nginx.conf

   # 静的ファイル収集
   RUN python manage.py collectstatic --noinput

   # 起動スクリプト
   COPY start.sh /start.sh
   RUN chmod +x /start.sh

   EXPOSE 80
   CMD ["/start.sh"]
   ```

2. **起動スクリプト作成** (backend/start.sh)

   ```bash
   #!/bin/bash

   # データベースマイグレーション
   python manage.py migrate

   # Gunicorn起動
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 &

   # Nginx起動
   nginx -g 'daemon off;'
   ```

3. **Docker イメージビルド・プッシュ**

   ```bash
   # AWS CLI 認証
   aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com

   # 統合イメージビルド
   cd backend
   docker build -t thisisjapan-backend .
   docker tag thisisjapan-backend:latest [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/thisisjapan-backend:latest

   # イメージプッシュ
   docker push [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/thisisjapan-backend:latest
   ```

### 3-3. ECS Cluster 作成

**AWS マネジメントコンソール > ECS**

1. **クラスター作成**
   ```
   クラスター名: thisisjapan-cluster
   インフラストラクチャ: AWS Fargate (サーバーレス)
   ```

### 3-4. ECS タスク定義作成

**ECS > タスク定義**

1. **基本設定**

   ```
   タスク定義ファミリー: thisisjapan-backend
   起動タイプ: AWS Fargate
   オペレーティングシステム: Linux/X86_64
   タスクロール: ecsTaskExecutionRole
   ```

2. **統合コンテナ設定**

   ```
   コンテナ名: nginx-django-app
   イメージURI: [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/thisisjapan-backend:latest
   メモリ: 512 MiB
   CPU: 0.25 vCPU
   ```

3. **ポートマッピング**

   ```
   コンテナポート: 80
   プロトコル: TCP
   ポート名: nginx-port
   アプリプロトコル: HTTP
   ```

4. **環境変数**

   ```
   環境変数:
   - DEBUG: 0
   - ALLOWED_HOSTS: api.thisisjapan.com
   - AWS_STORAGE_BUCKET_NAME: thisisjapan-files
   - AWS_DEFAULT_REGION: ap-northeast-1

   シークレット:
   - DATABASE_URL: thisisjapan/database:engine://username:password@host:port/dbname
   - SECRET_KEY: thisisjapan/app-config:SECRET_KEY
   - JWT_SECRET: thisisjapan/app-config:JWT_SECRET
   ```

5. **ログ設定**
   ```
   ログドライバー: awslogs
   ログ設定:
   - awslogs-group: /ecs/thisisjapan-backend
   - awslogs-region: ap-northeast-1
   - awslogs-stream-prefix: ecs
   ```

### 3-5. IAM ロール設定

**IAM > ロール**

1. **ECS タスクロール作成**

   ```
   信頼されたエンティティタイプ: AWSサービス
   ユースケース: Elastic Container Service → Elastic Container Service Task
   ロール名: thisisjapan-ecs-task-role
   ```

2. **ポリシーアタッチ**
   ```
   - AmazonS3FullAccess (本番環境では最小権限に変更)
   - SecretsManagerReadWrite
   ```

## ⚖️ Phase 4: ロードバランサー構築 (半日)

### 4-1. ALB 作成

**AWS マネジメントコンソール > EC2 > ロードバランサー**

1. **基本設定**

   ```
   ロードバランサータイプ: Application Load Balancer
   名前: thisisjapan-alb
   スキーム: インターネット向け
   IPアドレスタイプ: IPv4
   ```

2. **ネットワークマッピング**

   ```
   VPC: thisisjapan-vpc
   マッピング:
   - ap-northeast-1a: thisisjapan-public-subnet
   ```

3. **セキュリティグループ**

   ```
   セキュリティグループ: thisisjapan-alb-sg
   ```

4. **リスナーとルーティング**
   ```
   プロトコル: HTTPS
   ポート: 443
   デフォルトアクション: 新しいターゲットグループに転送
   ```

### 4-2. ターゲットグループ作成

1. **基本設定**

   ```
   ターゲットタイプ: IPアドレス
   ターゲットグループ名: thisisjapan-tg
   プロトコル: HTTP
   ポート: 80
   VPC: thisisjapan-vpc
   ```

2. **ヘルスチェック**
   ```
   ヘルスチェックパス: /health/ (Django で実装要)
   ヘルスチェック間隔: 30秒
   タイムアウト: 5秒
   正常閾値: 2
   非正常閾値: 5
   マッチャー: 200
   ```

### 4-3. ECS サービス作成

**ECS > クラスター > thisisjapan-cluster**

1. **サービス作成**

   ```
   起動タイプ: Fargate
   タスク定義: thisisjapan-backend
   サービス名: thisisjapan-service
   タスクの数: 1
   ```

2. **ネットワーク設定**

   ```
   VPC: thisisjapan-vpc
   サブネット: thisisjapan-private-subnet
   セキュリティグループ: thisisjapan-ecs-sg
   パブリックIP: 無効
   ```

3. **ロードバランサー設定**

   ```
   ロードバランサータイプ: Application Load Balancer
   ロードバランサー: thisisjapan-alb
   リスナー: 443:HTTPS
   ターゲットグループ: thisisjapan-tg
   ```

4. **Auto Scaling 設定**
   ```
   最小タスク数: 1
   希望タスク数: 1
   最大タスク数: 3
   ターゲット追跡スケーリングポリシー:
   - メトリクスタイプ: 平均CPU使用率
   - ターゲット値: 70%
   ```

## 🌐 Phase 5: DNS・SSL 設定 (半日)

### 5-1. Route53 ホストゾーン作成

**AWS マネジメントコンソール > Route53**

1. **ホストゾーン作成**

   ```
   ドメイン名: thisisjapan.com
   タイプ: パブリックホストゾーン
   ```

2. **ネームサーバー設定**
   - Route53 で表示されたネームサーバーを
   - ドメインレジストラ（お名前.com 等）で設定

### 5-2. ACM SSL 証明書取得

**AWS マネジメントコンソール > Certificate Manager**

1. **証明書リクエスト**

   ```
   証明書タイプ: パブリック証明書
   ドメイン名:
   - thisisjapan.com
   - *.thisisjapan.com
   検証方法: DNS検証
   ```

2. **DNS 検証**
   - ACM で表示された CNAME レコードを
   - Route53 で作成して検証完了

### 5-3. Route53 レコード作成

1. **API 用 A レコード**

   ```
   レコード名: api.thisisjapan.com
   レコードタイプ: A
   エイリアス: はい
   エイリアス先: ALB (thisisjapan-alb)
   ```

2. **WWW 用レコード (後で Vercel 設定時に作成)**

### 5-4. ALB HTTPS リスナー更新

**EC2 > ロードバランサー > thisisjapan-alb**

1. **HTTPS リスナー設定**

   ```
   プロトコル: HTTPS
   ポート: 443
   SSL証明書: ACMで取得した証明書を選択
   セキュリティポリシー: ELBSecurityPolicy-TLS-1-2-2017-01
   ```

2. **HTTP→HTTPS リダイレクト**
   ```
   プロトコル: HTTP
   ポート: 80
   デフォルトアクション: リダイレクト
   リダイレクト先: HTTPS 443
   ```

## 🚀 Phase 6: フロントエンドデプロイ (半日)

### 6-1. Vercel アカウント・プロジェクト設定

1. **Vercel ダッシュボード**

   - GitHub リポジトリ連携
   - プロジェクトインポート: frontend/
   - フレームワーク: Next.js

2. **ビルド設定**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Root Directory: frontend
   ```

### 6-2. 環境変数設定

**Vercel > プロジェクト > Settings > Environment Variables**

```
NEXT_PUBLIC_API_URL=https://api.thisisjapan.com
NEXTAUTH_URL=https://www.thisisjapan.com
NEXTAUTH_SECRET=[JWT_SECRET]
```

### 6-3. カスタムドメイン設定

**Vercel > プロジェクト > Settings > Domains**

1. **ドメイン追加**

   ```
   Domain: www.thisisjapan.com
   ```

2. **DNS 設定 (Route53)**
   ```
   レコード名: www.thisisjapan.com
   レコードタイプ: CNAME
   値: cname.vercel-dns.com (Vercelで表示される値)
   ```

## 📊 Phase 7: 監視・ログ設定 (半日)

### 7-1. CloudWatch ダッシュボード作成

**AWS マネジメントコンソール > CloudWatch**

1. **ダッシュボード作成**

   ```
   ダッシュボード名: ThisIsJapan-Monitoring
   ```

2. **ウィジェット追加**

   ```
   ECS CPU使用率:
   - メトリクス: AWS/ECS/CPUUtilization
   - サービス: thisisjapan-service

   ALB リクエスト数:
   - メトリクス: AWS/ApplicationELB/RequestCount
   - ロードバランサー: thisisjapan-alb

   RDS CPU使用率:
   - メトリクス: AWS/RDS/CPUUtilization
   - DBインスタンス: thisisjapan-db
   ```

### 7-2. CloudWatch アラーム設定

1. **ECS CPU 使用率アラーム**

   ```
   アラーム名: ThisIsJapan-ECS-HighCPU
   メトリクス: AWS/ECS/CPUUtilization
   閾値: 80% 以上 2分間
   アクション: SNS通知 (メール)
   ```

2. **RDS CPU 使用率アラーム**
   ```
   アラーム名: ThisIsJapan-RDS-HighCPU
   メトリクス: AWS/RDS/CPUUtilization
   閾値: 80% 以上 5分間
   アクション: SNS通知 (メール)
   ```

### 7-3. ログ設定確認

1. **ECS ログ確認**

   - CloudWatch > ロググループ: /ecs/thisisjapan-backend
   - ログストリーム: ecs/django-app/[タスク ID]

2. **ALB アクセスログ (オプション)**
   ```
   S3バケット: thisisjapan-files/alb-logs/
   ```

## ✅ デプロイ完了確認チェックリスト

### フロントエンド確認

- [ ] https://www.thisisjapan.com でアクセス可能
- [ ] ページが正常に表示される
- [ ] API 通信が成功している

### バックエンド確認

- [ ] https://api.thisisjapan.com/admin/ で管理画面アクセス可能
- [ ] API エンドポイントが応答している
- [ ] データベース接続が成功している

### セキュリティ確認

- [ ] HTTPS 通信が有効
- [ ] HTTP→HTTPS リダイレクトが動作
- [ ] 不要なポートが閉じられている

### 監視確認

- [ ] CloudWatch メトリクスが取得されている
- [ ] ログが正常に出力されている
- [ ] アラーム設定が有効

## 📊 Phase 8: CloudFront CDN 設定 (追加設定)

### 8-1. CloudFront ディストリビューション作成

**AWS マネジメントコンソール > CloudFront**

1. **ディストリビューション作成**

   ```
   オリジンドメイン: thisisjapan-files.s3.ap-northeast-1.amazonaws.com
   オリジンパス: 空白
   名前: thisisjapan-s3-origin
   ```

2. **デフォルトキャッシュビヘイビア**

   ```
   ビューワープロトコルポリシー: Redirect HTTP to HTTPS
   許可されたHTTPメソッド: GET, HEAD
   キャッシュキー: Legacy cache settings
   ```

3. **設定**

   ```
   価格クラス: すべてのエッジロケーションを使用 (最高のパフォーマンス)
   代替ドメイン名 (CNAME): cdn.thisisjapan.com
   SSL証明書: ACMの証明書を使用
   ```

### 8-2. Route53 CDN 用レコード作成

```
レコード名: cdn.thisisjapan.com
レコードタイプ: A
エイリアス: はい
エイリアス先: CloudFront distribution
```

## 🖥️ Phase 9: Session Manager セットアップ (管理用)

### 9-1. Systems Manager の設定

**AWS マネジメントコンソール > Systems Manager**

1. **Session Manager の有効化**

   ```
   Session Manager > 設定 > セッション設定
   - ログを CloudWatch に記録: 有効
   - ログ暗号化: 有効 (KMS)
   ```

2. **ECS Exec の有効化**

   ```
   ECS > サービス > thisisjapan-service > 更新
   - Enable Execute Command: ✓ チェック
   ```

### 9-2. コンテナへのアクセス方法

**ローカル環境から:**

```bash
# ECS Execでコンテナにアクセス
aws ecs execute-command \
  --cluster thisisjapan-cluster \
  --task [タスクID] \
  --container nginx-django-app \
  --interactive \
  --command "/bin/bash"

# Django管理コマンド実行例
python manage.py createsuperuser
python manage.py collectstatic
```

## 🛠️ トラブルシューティング

### ECS タスクが起動しない

1. **CloudWatch ログを確認**

   ```bash
   # AWSコンソール: CloudWatch > ロググループ > /ecs/thisisjapan-backend
   ```

2. **よくある原因**
   - Nginx 設定ファイルの構文エラー
   - 起動スクリプトの権限問題
   - Secrets Manager の権限不足
   - 環境変数の設定ミス

### NAT ゲートウェイ関連のトラブル

1. **ECS タスクが ECR からイメージをプルできない**

   - NAT ゲートウェイが正常に動作しているか確認
   - プライベートサブネットのルートテーブルに 0.0.0.0/0 → NAT-GW が設定されているか確認
   - Elastic IP が NAT ゲートウェイに関連付けられているか確認

2. **インターネットアクセスが必要な理由**
   ```
   ECS タスクが以下にアクセスするため:
   - ECR (Docker イメージプル)
   - Secrets Manager (認証情報取得)
   - PyPI等 (パッケージ更新)
   - 外部API (必要に応じて)
   ```

### 統合コンテナのトラブル

1. **Nginx 設定確認**

   ```nginx
   # backend/nginx.conf (参考例)
   events {
       worker_connections 1024;
   }

   http {
       upstream django {
           server 127.0.0.1:8000;
       }

       server {
           listen 80;
           location / {
               proxy_pass http://django;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
           }

           location /static/ {
               alias /app/staticfiles/;
           }
       }
   }
   ```

2. **起動順序の確認**
   - Gunicorn → Nginx の順で起動されているか

### RDS 接続エラー

1. **セキュリティグループ確認**
   - ECS → RDS の 5432 ポートが開いているか
2. **接続文字列確認**
   ```python
   # DATABASE_URL形式
   postgresql://postgres:[パスワード]@[RDSエンドポイント]:5432/thisisjapan
   ```

### ALB ヘルスチェック失敗

1. **Django ヘルスチェックエンドポイント実装**

   ```python
   # backend/urls.py
   from django.http import JsonResponse

   def health_check(request):
       return JsonResponse({'status': 'healthy'})

   urlpatterns = [
       path('health/', health_check),
       # ...
   ]
   ```

2. **ターゲットグループ確認**
   - ヘルスチェックパス: /health/
   - ポート: 80 (Nginx)

### S3 ファイルアップロード失敗

1. **統合バケット権限確認**
   - ECS タスクロールに S3 アクセス権限があるか
   - media/ と static/ 両方のパスに書き込み権限があるか
2. **CORS 設定確認**
   - S3 バケットの CORS 設定が正しいか

## 📚 運用・保守

### 定期メンテナンス

- **月次**: セキュリティアップデート確認・S3 統合バケット使用量確認
- **週次**: ログ・メトリクス確認・CloudFront キャッシュ統計確認
- **日次**: アプリケーション動作確認・統合コンテナの正常性確認

### スケーリング

- **ECS Auto Scaling**: CPU 使用率 70%でスケールアウト
- **RDS**: 必要に応じてインスタンスサイズ変更
- **S3 + CloudFront**: 自動スケーリング (使用量課金)
- **統合コンテナ**: Nginx + Django 両方がスケールアウト

### バックアップ

- **RDS**: 自動バックアップ 7 日間保持
- **S3 統合バケット**: バージョニング有効化 (本番環境)
- **コード**: Git リポジトリ
- **設定ファイル**: nginx.conf, start.sh のバックアップ

### 初心者向け管理のコツ

1. **Session Manager 活用**

   - EC2 への SSH 不要、ブラウザから直接管理
   - キーペアの管理が不要

2. **統合監視**

   - CloudWatch で ECS, RDS, ALB をまとめて監視
   - 複雑な設定は後回し、基本メトリクスから開始

3. **トラブル時の対応順序**
   - CloudWatch ログを確認
   - ECS Exec でコンテナ内を直接確認
   - 必要に応じて ECS サービスを再起動

## ✅ 最終確認チェックリスト

### 統合構成の確認

- [ ] ECS 統合タスク（Nginx + Django）が正常起動
- [ ] S3 統合バケットで media/ と static/ の両方が機能
- [ ] CloudFront CDN が S3 統合バケットから配信
- [ ] Session Manager で ECS コンテナにアクセス可能

### 従来のチェック項目

- [ ] フロントエンドとバックエンドの接続テスト
- [ ] ユーザー登録とログインフロー
- [ ] コンテンツのアップロードとダウンロード
- [ ] サーバーパフォーマンステスト
- [ ] セキュリティスキャン
- [ ] モバイル互換性テスト
