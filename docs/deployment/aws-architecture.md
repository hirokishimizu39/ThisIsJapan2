# できるだけ最小構成で実現
```mermaid
graph TD
    %% ユーザー
    User["👤 ユーザー"]
    Admin["👨‍💻 管理者"]

    %% インターネット
    Internet["🌐 インターネット"]

    %% Vercel (フロントエンド)
    Vercel["🚀 Vercel<br/>- Next.js App<br/>- www\.thisisjapan.com"]

    %% CloudFront
    CloudFront["⚡ CloudFront CDN<br/>- 静的ファイル配信<br/>- 画像最適化"]

    %% AWS Services
    subgraph AWS["☁️ AWS"]
        %% Route53
        Route53["🌐 Route53<br/>- DNS管理<br/>・www → Vercel<br/>・api → ALB DNS名"]

        %% Certificate Manager
        ACM["🔒 ACM<br/>- SSL証明書<br/>- *.thisisjapan.com"]

        %% Application Load Balancer
        ALB["⚖️ ALB<br/>- api.thisisjapan.com<br/>- HTTPS終端<br/>- ヘルスチェック"]

        %% VPC
        subgraph VPC["🏠 VPC (10.0.0.0/16)"]
            %% VPC Endpoints
            S3Endpoint["📦 VPC Endpoint<br/>- S3 Gateway型<br/>- 無料"]

            subgraph PublicSubnet["Public Subnet (10.0.1.0/24)"]
                ALB
            end

            subgraph PrivateSubnet["Private Subnet (10.0.2.0/24)"]
                ECSTask["🐳 ECS Task (1個)<br/>- Nginx + Django + Gunicorn<br/>- Auto Scaling (min:1, max:3)<br/>- IAM Role統合"]
                RDS["🗄️ RDS PostgreSQL<br/>- t3.micro<br/>- Single-AZ (MVP)<br/>- 自動バックアップ"]
            end
        end

        %% ECS Cluster
        ECSCluster["🐳 ECS Cluster<br/>- Fargate<br/>- Auto Scaling有効<br/>- 1タスクから開始"]

        %% S3 (統合)
        S3Unified["📦 S3 統合バケット<br/>thisisjapan-files<br/>├── media/ (ユーザー画像)<br/>└── static/ (Django管理画面)"]

        %% Secrets Manager
        SecretsManager["🔐 Secrets Manager<br/>- DATABASE_URL<br/>- SECRET_KEY<br/>- JWT_SECRET"]

        %% CloudWatch (統合監視)
        CloudWatch["📊 CloudWatch統合<br/>- ECS/ALB/RDS全監視<br/>- 基本メトリクス<br/>- 簡単アラート"]

        %% Session Manager
        SessionManager["🖥️ Session Manager<br/>- Bastion不要<br/>- ブラウザアクセス<br/>- キーペア管理不要"]

        %% Security Groups (簡素化)
        ALBSG["🛡️ ALB SG<br/>- HTTPS (443) のみ"]
        ECSSG["🛡️ ECS SG<br/>- HTTP (80) from ALB"]
        RDSSG["🛡️ RDS SG<br/>- PostgreSQL (5432) from ECS"]
    end

    %% メインフロー
    User --> Internet
    Internet --> Route53
    Route53 -->|"www\.thisisjapan.com"| Vercel
    Route53 -->|"api.thisisjapan.com"| ALB

    %% CloudFrontフロー
    Internet --> CloudFront
    CloudFront --> S3Unified

    %% API通信フロー
    Vercel -->|"HTTPS API<br/>JWT認証"| ALB
    ALB --> ACM
    ALB --> ECSTask

    %% バックエンド内部通信
    ECSTask --> S3Endpoint
    S3Endpoint --> S3Unified
    ECSTask --> RDS
    ECSTask --> SecretsManager

    %% 管理者アクセス (簡素化)
    Admin -->|"Session Manager<br/>ブラウザから"| SessionManager
    SessionManager -.->|"ECS Exec<br/>コンテナ内アクセス"| ECSTask
    SessionManager -.->|"RDS接続<br/>SSMトンネル"| RDS

    %% ECS Cluster関連
    ECSTask --> ECSCluster
    ECSCluster --> CloudWatch
    RDS --> CloudWatch
    ALB --> CloudWatch

    %% Security Groups
    ALB --> ALBSG
    ECSTask --> ECSSG
    RDS --> RDSSG

    %% Style
    classDef vercel fill:#000,stroke:#fff,stroke-width:2px,color:#fff
    classDef aws fill:#ff9900,stroke:#232f3e,stroke-width:2px,color:#232f3e
    classDef database fill:#336791,stroke:#fff,stroke-width:2px,color:#fff
    classDef storage fill:#569a31,stroke:#fff,stroke-width:2px,color:#fff
    classDef security fill:#ff4444,stroke:#fff,stroke-width:2px,color:#fff
    classDef compute fill:#ff9900,stroke:#232f3e,stroke-width:2px,color:#232f3e
    classDef management fill:#9d5025,stroke:#fff,stroke-width:2px,color:#fff
    classDef cdn fill:#ff6b35,stroke:#fff,stroke-width:2px,color:#fff

    class Vercel vercel
    class Route53,ALB,ACM,ECSCluster aws
    class RDS database
    class S3Unified,S3Endpoint storage
    class ALBSG,ECSSG,RDSSG,SecretsManager security
    class ECSTask compute
    class SessionManager,CloudWatch management
    class CloudFront cdn