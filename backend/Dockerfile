FROM python:3.12-alpine@sha256:c08bfdbffc9184cdfd225497bac12b2c0dac1d24bbe13287cfb7d99f1116cf43 AS backend

WORKDIR /app/backend

# 依存関係のインストール
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# バックエンドのソースコードをコピー
COPY backend/ .

# 開発サーバー起動コマンド
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]