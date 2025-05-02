# This is Japan

## プロジェクト概要

日本の文化や体験を世界に発信するためのプラットフォーム。写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を世界に伝えることを目指します。

## 主要機能

- 写真共有機能
- 日本語・言葉の共有
- 文化体験の紹介
- ユーザー管理

## ドキュメント構成

- [開発参加ガイド](./CONTRIBUTING.md)
- [環境構築ガイド](./SETUP.md)
- [システム設計書](./architecture/system-architecture.md)
- [技術スタック詳細](./architecture/technology-stack.md)
- [DB 設計書](./database/database-design.md)
- [API リソース設計書](./api/api-specification.md)
- [デプロイメントガイド](./deployment/deployment-guide.md)

## 本番環境

- フロントエンド: Vercel
- バックエンド: AWS (ECS Fargate)
- データベース: AWS RDS (PostgreSQL)
- ストレージ: AWS S3
- DNS: AWS Route53


## デザイン要件:
- モダンでミニマルなデザイン
- 日本の美意識を反映（余白、シンプルさ）
- ダークモード対応
- Noto Sans JP, Noto Serif JPフォントの使用

### 主な画面:
- ホームページ（写真、言葉、体験のプレビュー）
- 認証ページ（登録・ログイン）
- コンテンツ詳細ページ

### 配色:
- メインカラー: インディゴ (224 34% 27%)
- アクセント: 日本の赤 (349 53% 59%)
- 背景: オフホワイト (0 0% 97%)