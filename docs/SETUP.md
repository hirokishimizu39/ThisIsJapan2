# This is Japan - 環境構築ガイド

このドキュメントでは、This is Japan プロジェクトの開発環境を構築する手順を説明します。

## 必要条件

開発を始める前に、以下のツールがインストールされていることを確認してください。

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/hirokishimizu39/ThisIsJapan2.git
cd ThisIsJapan2
```

### 2. 環境変数の設定

バックエンド用の環境変数ファイルを作成します。
[環境変数の設定方法](https://github.com/hirokishimizu39/ThisIsJapan2/blob/main/docs/environment_variables.md)


### 3. Docker コンテナのビルドと起動

```bash
docker compose up --build
```

これにより、以下のサービスが起動します：

- PostgreSQL データベース: `localhost:5432`
- Django バックエンド: `localhost:8000`
- Next.js フロントエンド: `localhost:3000`

### 4. データベースのマイグレーション

新しいターミナルを開いて、以下のコマンドを実行します：

```bash
docker compose exec backend python3 manage.py migrate
```

### 5. 開発用管理者アカウントの作成（オプション）

```bash
docker compose exec backend python3 manage.py createsuperuser
```

指示に従って、管理者ユーザーを作成してください。

## 開発環境へのアクセス

- **フロントエンド**: [http://localhost:3000](http://localhost:3000)
- **バックエンド API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **API ドキュメント**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Django 管理画面**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

## 開発ワークフロー

### フロントエンド開発

フロントエンドのコードを変更すると、Next.js の開発サーバーが自動的に変更を検知して再ビルドします。

### バックエンド開発

バックエンドのコードを変更した場合、Django 開発サーバーは自動的に変更を検知します。ただし、モデルの変更を行った場合は、マイグレーションを作成して適用する必要があります：

```bash
docker compose exec backend python3 manage.py makemigrations
docker compose exec backend python manage.py migrate
```

### 依存関係の追加

#### バックエンド（Python）

`backend/requirements.txt`に依存関係を追加し、コンテナを再ビルドします：

```bash
docker compose build backend
docker compose up -d
```

#### フロントエンド（Node.js）

```bash
docker compose exec frontend npm install パッケージ名
```

または、`frontend/package.json`に依存関係を追加し、コンテナを再ビルドします：

```bash
docker compose build frontend
docker compose up -d
```

## テスト実行

### バックエンドテスト

```bash
docker compose exec backend python3 manage.py test
```

### フロントエンドテスト

```bash
docker compose exec frontend npm test
```

## 開発環境の停止

開発作業を終了する場合は、以下のコマンドでコンテナを停止できます：

```bash
docker compose down
```

データベースのデータを完全に削除してコンテナを停止する場合は：

```bash
docker compose down -v
```

## トラブルシューティング

### ポートの競合

指定されたポート（3000、8000、5432）がすでに使用されている場合は、`docker-compose.yml`ファイルでポート設定を変更してください。

### パッケージのインストール問題

依存関係のインストールに問題がある場合は、キャッシュをクリアしてみてください：

```bash
docker compose build --no-cache
```

### データベース接続エラー

データベースへの接続に問題がある場合は、データベースコンテナが正常に起動しているか確認してください：

```bash
docker compose logs db
```

## 補足情報

- 本番環境へのデプロイ手順については、[デプロイメントガイド](deployment/deployment-guide.md)を参照してください。
