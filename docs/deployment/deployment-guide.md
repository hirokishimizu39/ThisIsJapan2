# This is Japan - デプロイメントガイド

このドキュメントでは、AWS 初心者でも**マネジメントコンソール**を使って、This is Japan アプリケーションを本番環境にデプロイする手順を説明します。

## デプロイメントアーキテクチャ

This is Japan は、以下の**シンプルな構成**でデプロイします：

### 全体構成

```
[ユーザー] → [Vercel (Next.js)] → [AWS Route53] → [ALB] → [ECS (1タスク)] → [RDS PostgreSQL]
                                                                      ↘ [S3統合バケット]
```

### 主要コンポーネント

- **フロントエンド**: Next.js 15 (Vercel でホスティング)
- **バックエンド**: Django REST API (ECS Fargate - 1 タスクから開始)
- **データベース**: PostgreSQL (RDS t3.micro - Single-AZ)
- **ストレージ**: S3 統合バケット (media/ + static/)
- **CDN**: CloudFront (静的ファイル配信)
- **DNS**: Route53 + ACM SSL 証明書

![アーキテクチャ図](aws-architecture.md)

## 💰 予想コスト (MVP 段階)

```
月額概算:
├── ALB: $16/月
├── ECS Fargate: $8/月 (1タスク)
├── RDS t3.micro: $13/月
├── S3 + CloudFront: $3/月
├── Route53: $0.5/月
├── Secrets Manager: $1/月
└── CloudWatch: $2/月
────────────────────────
合計: 約$43/月 (約6,000円/月)
```

## 📋 事前準備

### 必要なアカウント・ツール

- AWS アカウント (無料利用枠推奨)
- Vercel アカウント
- ドメイン名 (例: thisisjapan.com)
- Docker Desktop (ローカルでのイメージビルド用)

### 環境変数の準備

以下の値を事前に決めておいてください：

```bash
# アプリケーション設定
DOMAIN_NAME=thisisjapan.com
DB_PASSWORD=secure_password_123
SECRET_KEY=django_secret_key_here
JWT_SECRET=jwt_secret_key_here

# AWS設定
AWS_REGION=ap-northeast-1
BUCKET_NAME=thisisjapan-files
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

4. **ルートテーブル設定**

   **パブリック用:**

   ```
   名前: thisisjapan-public-rt
   ルート追加: 0.0.0.0/0 → thisisjapan-igw
   サブネット関連付け: thisisjapan-public-subnet
   ```

   **プライベート用:**

   ```
   名前: thisisjapan-private-rt
   サブネット関連付け: thisisjapan-private-subnet
   (インターネットアクセス用のNATゲートウェイは後で設定)
   ```

### 1-2. セキュリティグループ作成

**AWS マネジメントコンソール > EC2 > セキュリティグループ**

1. **ALB 用セキュリティグループ**

   ```
   名前: thisisjapan-alb-sg
   説明: ALB security group
   VPC: thisisjapan-vpc

   インバウンドルール:
   - HTTPS (443) | 0.0.0.0/0
   - HTTP (80) | 0.0.0.0/0 (HTTPSリダイレクト用)
   ```

2. **ECS 用セキュリティグループ**

   ```
   名前: thisisjapan-ecs-sg
   説明: ECS security group
   VPC: thisisjapan-vpc

   インバウンドルール:
   - HTTP (80) | ソース: thisisjapan-alb-sg
   ```

3. **RDS 用セキュリティグループ**

   ```
   名前: thisisjapan-rds-sg
   説明: RDS security group
   VPC: thisisjapan-vpc

   インバウンドルール:
   - PostgreSQL (5432) | ソース: thisisjapan-ecs-sg
   ```

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

### 2-2. S3 バケット作成

**AWS マネジメントコンソール > S3**

1. **バケット作成**

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

3. **バケットポリシー設定**
   バケット > アクセス許可 > バケットポリシー:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::thisisjapan-files/media/*"
       }
     ]
   }
   ```

4. **CORS 設定**
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

### 3-2. Docker イメージのビルド・プッシュ

**ローカル環境で実行:**

1. **AWS CLI 認証**

   ```bash
   aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com
   ```

2. **Docker イメージビルド**

   ```bash
   cd backend
   docker build -t thisisjapan-backend .
   docker tag thisisjapan-backend:latest [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/thisisjapan-backend:latest
   ```

3. **イメージプッシュ**
   ```bash
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

2. **コンテナ設定**

   ```
   コンテナ名: django-app
   イメージURI: [アカウントID].dkr.ecr.ap-northeast-1.amazonaws.com/thisisjapan-backend:latest
   メモリ: 512 MiB
   CPU: 0.25 vCPU
   ```

3. **ポートマッピング**

   ```
   コンテナポート: 8000
   プロトコル: TCP
   ポート名: django-port
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
   ポート: 8000
   VPC: thisisjapan-vpc
   ```

2. **ヘルスチェック**
   ```
   ヘルスチェックパス: /health/ (Django で実装要)
   ヘルスチェック間隔: 30秒
   タイムアウト: 5秒
   正常閾値: 2
   非正常閾値: 5
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

## 🛠️ トラブルシューティング

### ECS タスクが起動しない

1. **CloudWatch ログを確認**

   ```bash
   # AWSコンソール: CloudWatch > ロググループ > /ecs/thisisjapan-backend
   ```

2. **よくある原因**
   - Secrets Manager の権限不足
   - 環境変数の設定ミス
   - Docker イメージの問題

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
   - ポート: 8000

### S3 ファイルアップロード失敗

1. **IAM ロール権限確認**
   - ECS タスクロールに S3 アクセス権限があるか
2. **CORS 設定確認**
   - S3 バケットの CORS 設定が正しいか

## 📚 運用・保守

### 定期メンテナンス

- **月次**: セキュリティアップデート確認
- **週次**: ログ・メトリクス確認
- **日次**: アプリケーション動作確認

### スケーリング

- **ECS Auto Scaling**: CPU 使用率 70%でスケールアウト
- **RDS**: 必要に応じてインスタンスサイズ変更
- **S3**: 自動スケーリング (使用量課金)

### バックアップ

- **RDS**: 自動バックアップ 7 日間保持
- **S3**: バージョニング有効化 (本番環境)
- **コード**: Git リポジトリ

- [ ] フロントエンドとバックエンドの接続テスト
- [ ] ユーザー登録とログインフロー
- [ ] コンテンツのアップロードとダウンロード
- [ ] サーバーパフォーマンステスト
- [ ] セキュリティスキャン
- [ ] モバイル互換性テスト
