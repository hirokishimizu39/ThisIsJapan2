# Node.js 22 の軽量イメージを指定し、固定されたバージョン（SHA256で検証可能）を使用して信頼性を確保
FROM node:22-slim@sha256:557e52a0fcb928ee113df7e1fb5d4f60c1341dbda53f55e3d815ca10807efdce AS frontend

# 作業ディレクトリを /app/frontend に設定（以降の操作はこのディレクトリ内で実行される）
WORKDIR /app/frontend

# ARM64アーキテクチャでのTailwindCSS/lightningcss問題を回避するための環境変数設定
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max_old_space_size=4096"
# CSS処理をスキップしてlightningcssの問題を回避
ENV NEXT_SKIP_STYLESHEET_PROCESSING=true

# 依存関係のインストール用にpackage.jsonをコピー
COPY frontend/package*.json ./

# 依存関係をインストール
RUN npm install

# フロントエンドのソースコードをコピー
COPY frontend/ .

# 起動時に依存関係をチェックして開発サーバーを起動
CMD ["sh", "-c", "npm install && npm run dev"]
