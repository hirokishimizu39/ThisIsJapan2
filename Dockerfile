FROM python:alpine AS backend

WORKDIR /app/backend

# 依存関係のインストール
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# バックエンドのソースコードをコピー
COPY backend/ .

# 開発サーバー起動コマンド
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM node:slim AS build

WORKDIR /app/frontend

# 依存関係のインストール
COPY frontend/package*.json ./
RUN npm install

# フロントエンドのソースコードをコピー
COPY frontend/ .

# 開発サーバー起動コマンド
CMD ["npm", "run", "dev"] 