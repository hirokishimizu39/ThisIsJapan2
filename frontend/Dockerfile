FROM node:22-slim@sha256:557e52a0fcb928ee113df7e1fb5d4f60c1341dbda53f55e3d815ca10807efdce AS frontend

WORKDIR /app/frontend

# 依存関係のインストール
COPY frontend/package*.json ./
RUN npm install

# フロントエンドのソースコードをコピー
COPY frontend/ .

# 開発サーバー起動コマンド
CMD ["npm", "run", "dev"] 