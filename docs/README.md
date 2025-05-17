# ドキュメント構成

プロジェクトの詳細は以下のドキュメントを参照してください：

### 開発者向け

- [開発参加ガイド](CONTRIBUTING.md) - プロジェクトへの貢献方法
- [環境構築ガイド](SETUP.md) - 開発環境のセットアップ方法

### システム設計

- [システム設計書](architecture/system-architecture.md) - 全体アーキテクチャと BFF 設計
- [技術スタック詳細](architecture/technology-stack.md) - 使用技術と選定理由

### データモデルと API

- [データベース設計書](database/database-design.md) - ER ダイアグラムとテーブル定義
- [API リソース設計書](api/api-specification.md) - エンドポイント一覧と使用例
  - バックエンド API (Django REST Framework)
  - フロントエンド API (Next.js Route Handlers)
- [OpenAPI 仕様書](api/openapi.yaml) - API 仕様の詳細定義（Swagger UI 対応）

### 運用

- [デプロイメントガイド](deployment/deployment-guide.md) - 本番環境へのデプロイ手順

## アーキテクチャ概要

本プロジェクトは、以下のような BFF（Backend for Frontend）アーキテクチャを採用しています：

```
[Browser] → [Next.js Route Handlers (BFF)] → [Django REST API] → [Database]
```

詳細は[システム設計書](architecture/system-architecture.md)を参照してください。

## 最新情報

- 2025-06-01: BFF（Backend for Frontend）アーキテクチャの導入
- 2025-05-05: ドキュメントを初期整備
