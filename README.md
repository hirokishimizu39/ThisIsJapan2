# はじめに

本リポジトリでは、以下の技能をアピールいたします。

- **フロントエンド**

  - [**React**](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Frameworks_libraries/React_getting_started)での宣言型プログラミングによるコンポーネント指向 UI の実装
  - React+[**TypeScript**](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)による型安全かつ再利用性の高い UI の実現
  - [**Next.js**(app router)](https://nextjs.org/learn/dashboard-app)での CSR,SSR,SSG の使い分けによるパフォーマンス最適化と SEO 強化

- **バックエンド**

  - [Django(Python)でのRESTful **API 開発**](https://www.django-rest-framework.org/api-guide/requests/)
  - TypeScript クライアントとの統合を前提としたエンドポイント設計

- **DB**

  - [PostgreSQL](https://www.postgresql.org/docs/14/index.html)(Django ORM) の10以上のテーブルを設計・運用し、マイグレーションやバリデーションを通じてセキュアで保守性のあるデータ管理を実現


- **インフラ**
  - [Docker](https://docs.docker.jp/get-started/overview.html#) で開発環境から本番環境までをコンテナ化し、一貫性のあるビルド・デプロイを実現
  - AWS([Fargate for ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html), S3, RDS, Route53, IAM)を活用し、スケーラブルかつサーバーレスなコンテナ運用基盤を構築
- （今後実現予定...CI/CD）
  - GitHub Actions, Terraform を導入し、IaC および 自動テスト/静的解析による CI/CD を強化予定
- 開発ツール
  - Vim, Terminal, Warp
  - VSCode, Cursor
  - Git, Github(CLI, GUIどちらでも)

<br>

**↓↓↓ 上記の技能を発揮し、アプリを開発しました。↓↓↓**

# アプリ概要

### アプリ名：

- This is Japan.🇯🇵

### Goal：

- 日本の文化や体験を世界に発信するためのプラットフォーム。写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を世界に伝える <br>

### KGI：

- インバウンドの地方分散と消費額の 30%増加
- 日本人であることに誇りに思うと答える人が 9 割になる(現状: 7 割)
- 地方の隠れた文化資源の発掘と継承(日本の文化について、「このアプリ経由で初めて知った」と答える方が 50%を超える何かを発掘)
- 参加する日本人ホストの英会話力, 異文化対応スキル向上と地域活性化（このアプリがきっかけで英語を使う仕事に就いたという方が 1 人以上出る）

## 完成したらデモ動画を貼る

デモ動画

## 主要機能

### 1. 写真共有機能（フェーズ 1）

- 日本の風景や文化的な写真の投稿・閲覧
- いいね・コメント・ブックマーク機能
- 人気順表示

### 2. 日本語・言葉の共有（フェーズ 1）

- 日本語の言葉や概念の投稿
- 英語での説明付き
- いいね・コメント・ブックマーク機能
- 人気順表示

### 3. 文化体験の紹介（フェーズ 2）

- 日本の伝統文化体験の紹介
- 場所情報付き
- 写真付きの詳細説明
- 地図 API を使ったローカルな文化体験の発見
- いいね・コメント・ブックマーク機能

### 4. ユーザー管理（フェーズ 1）

- ユーザー登録・ログイン機能
- 日本人/外国人の区分け
- 言語レベルの設定（母国語、日本語レベル、英語レベル）
- ユーザー別の投稿管理
- マイページでのいいね・ブックマーク管理

### 独自アルゴリズム（フェーズ 3）

- 地域分散アルゴリズム
  - 写真・文化体験は地方であるほど優位になるようにする
    - そのため写真・体験には地域のタグをつける
    - インバウンドの消費額から
- マッチングアルゴリズム
  - 外国人 - 日本人マッチング
    - 未定

# ドキュメント一覧

- [ファイル構造](https://github.com/hirokishimizu39/ThisIsJapan2/blob/main/docs/architecture/file-structure.md)
- [システムアーキテクチャ](https://github.com/hirokishimizu39/ThisIsJapan2/blob/main/docs/architecture/system-architecture.md)
- [AWS 構成図](docs/deployment/aws-architecture.md)
- [技術スタック詳細](docs/architecture/technology-stack.md)
- [API リソース設計書](docs/api/api-specification.md)
- [DB 設計書](docs/database/database-design.md)
- [環境構築ガイド](docs/SETUP.md)
- [開発参加ガイド](docs/CONTRIBUTING.md)
- [デザイン要件](https://github.com/hirokishimizu39/ThisIsJapan2/blob/feature/photo/docs/design/design.md)
- [デプロイメントガイド](docs/deployment/deployment-guide.md)
- [デザイン](docs/design/design.md)

---

# Column.
- 日本人について
  - 武士道
  - 戦後日本　https://youtu.be/q28drkmUSqY?si=ulWCYxBsHZQ79AAY
