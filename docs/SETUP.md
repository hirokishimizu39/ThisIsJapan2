# 環境構築ガイド

## 必要要件

- Node.js 18.x 以上
- Python 3.11 以上
- PostgreSQL 15.x 以上
- Docker (オプション)

## フロントエンド環境構築

1. リポジトリのクローン

```bash
git clone https://github.com/your-org/ThisIsJapan2.git
cd ThisIsJapan2
```

2. 依存関係のインストール

```bash
npm install
```

3. 環境変数の設定

```bash
cp .env.example .env.local
# .env.localを編集
```

4. 開発サーバーの起動

```bash
npm run dev
```

## バックエンド環境構築

1. Python 仮想環境の作成と有効化

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. 依存関係のインストール

```bash
pip install -r requirements.txt
```

3. 環境変数の設定

```bash
cp .env.example .env
# .envを編集
```

4. データベースの設定

```bash
# PostgreSQLデータベースの作成
createdb thisisjapan

# マイグレーション
python manage.py migrate
```

5. 開発サーバーの起動

```bash
python manage.py runserver
```

## Docker 環境（オプション）

1. コンテナのビルドと起動

```bash
docker-compose up --build
```

## 環境変数設定

### フロントエンド (.env.local)

```
DJANGO_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### バックエンド (.env)

```
DEBUG=True
SECRET_KEY=your-django-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://user:password@localhost:5432/thisisjapan
```

## 動作確認

1. フロントエンド

- http://localhost:3000 にアクセス
- 開発者ツールでエラーがないことを確認

2. バックエンド

- http://localhost:8000/admin にアクセス
- API エンドポイントの動作確認

## トラブルシューティング

### よくある問題と解決方法

1. パッケージのインストールエラー

```bash
npm clean-install
# または
pip install -r requirements.txt --no-cache-dir
```

2. データベース接続エラー

- PostgreSQL サービスが起動していることを確認
- DATABASE_URL の設定を確認

3. 環境変数関連のエラー

- .env.local と.env ファイルの存在確認
- 必要な環境変数がすべて設定されているか確認
