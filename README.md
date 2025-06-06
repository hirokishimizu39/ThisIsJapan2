# はじめに
本リポジトリでは、私、`Hiroki Shimizu`が以下の技能を持つことを証明いたします。
- **フロントエンド**
  - Reactによるコンポーネント指向かつ宣言型UIの実現
  - React+TypeScriptによる型安全かつ再利用性の高いUIの実装
  - Next.jsでのSSRやSSGの使い分けによるパフォーマンス最適化とSEO強化

- **バックエンド**
  - Django(Python)でのRESTful API開発(OpenAPI仕様準拠)
  - TypeScriptクライアントとシームレスに連携可能なエンドポイント設計

- **データベース**
  - PostgreSQLをORM(Django ORM)で設計・運用し、効率的かつ安全なデータ管理を実現

- **インフラ／CI/CD**
  - Dockerで開発環境から本番環境までをコンテナ化し、一貫性のあるビルド・デプロイを実現
  - AWS ECS＋Fargateを利用したコンテナデプロイにより、スケーラブルなサーバーレス運用を構築
  - （今後はGitHub Actions・Terraformを導入し、Infrastructure as Codeおよび自動テスト／静的解析によるCI/CDを強化予定）

これらの技術を組み合わせ、TypeScriptを軸としたフロント〜バックエンド、データベース設計、Dockerを活用したインフラ構築まで、フルスタックで開発・運用できるスキルセットを証明します。

    

## This is Japan プロジェクト概要

日本の文化や体験を世界に発信するためのプラットフォーム。写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を世界に伝えることを目指します。

- インバウンドの地方分散と消費額の 30%増加
- 地方の隠れた文化資源の発掘と継承
- 参加する日本人ホストの英会話力, 異文化対応スキル向上と地域活性化
（日本人が自国を誇れますように。）

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

## 独自アルゴリズム（フェーズ 3）

- 地域分散アルゴリズム
  - 写真・文化体験は地方であるほど優位になるようにする
    - そのため写真・体験には地域のタグをつける
    - インバウンドの消費額から
- マッチングアルゴリズム
  - 外国人 - 日本人マッチング
    - 未定



- [ファイル構造](https://github.com/hirokishimizu39/ThisIsJapan2/blob/main/docs/architecture/file-structure.md)
- [システムアーキテクチャ](https://github.com/hirokishimizu39/ThisIsJapan2/blob/main/docs/architecture/system-architecture.md)
- [技術スタック詳細](docs/architecture/technology-stack.md)
- [API リソース設計書](docs/api/api-specification.md)
- [DB 設計書](docs/database/database-design.md)
- [環境構築ガイド](docs/SETUP.md)
- [開発参加ガイド](docs/CONTRIBUTING.md)
- [デザイン要件](https://github.com/hirokishimizu39/ThisIsJapan2/blob/feature/photo/docs/design/design.md)
- [デプロイメントガイド](docs/deployment/deployment-guide.md)


---
- 日本人について
  - 武士道
  - 戦後日本　https://youtu.be/q28drkmUSqY?si=ulWCYxBsHZQ79AAY
