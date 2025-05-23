参照：https://qiita.com/Ajyarimochi/items/c6274c4aa8f21f573265

# JWTによる認証機能の実装

1. JWTの実装：`simplejwt`パッケージのインストール
2. settings.pyにJWT認証の設定を追加
3. urls.pyにJWT認証APIエンドポイント作成
4. curlコマンドでJWTのアクセストークンを取得
5. curlコマンドでGET、POST、PUT、DELETEのリクエストをそれぞれ投げて動作確認
6. CORSの設定
7. Next.jsでのトークン取得と管理（login, logout, refresh）


---

## 1. JWTの実装：`simplejwt`導入

requirements.txtに書いているので、dockerでbuildするだけでOK

```bash
pip install djangorestframework-simplejwt
```

### `settings.py` に設定追加：

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

---

## 2. JWT認証APIエンドポイント作成

### `urls.py` に以下を追加：

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

---

## 3. Next.js 側でトークンの取得と管理

### ログイン時にAPIへPOSTリクエスト：

```javascript
const res = await fetch("http://localhost:8000/api/token/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});

const data = await res.json();
localStorage.setItem("access_token", data.access);
localStorage.setItem("refresh_token", data.refresh);
```

---

### APIを叩く時にトークンをヘッダーに付ける：

```javascript
const token = localStorage.getItem("access_token");

const res = await fetch("http://localhost:8000/api/protected/", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

### ✅ 補足：リフレッシュ処理

アクセストークンが期限切れの場合、以下のように更新：

```javascript
const refresh = localStorage.getItem("refresh_token");

const res = await fetch("http://localhost:8000/api/token/refresh/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refresh }),
});

const data = await res.json();
localStorage.setItem("access_token", data.access);
```

---




# TypeScriptで書く場合


以下は、Next.js側の**JavaScriptコードをTypeScriptに書き換えたもの**です。基本的に型注釈を追加し、安全性を高めています。

---

## ✅ ログイン時にトークンを取得する処理（TypeScript）

```ts
interface LoginResponse {
  access: string;
  refresh: string;
}

export const login = async (username: string, password: string): Promise<void> => {
  const res = await fetch("http://localhost:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("ログインに失敗しました");
  }

  const data: LoginResponse = await res.json();
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
};
```

---

## ✅ 認証付きでAPIを叩く処理（TypeScript）

```ts
export const fetchWithAuth = async (url: string): Promise<any> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("アクセストークンが見つかりません");
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("APIリクエストに失敗しました");
  }

  return await res.json();
};
```

---

## ✅ トークンリフレッシュ処理（TypeScript）

```ts
interface RefreshResponse {
  access: string;
}

export const refreshToken = async (): Promise<void> => {
  const refresh = localStorage.getItem("refresh_token");

  if (!refresh) {
    throw new Error("リフレッシュトークンが見つかりません");
  }

  const res = await fetch("http://localhost:8000/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    throw new Error("トークンのリフレッシュに失敗しました");
  }

  const data: RefreshResponse = await res.json();
  localStorage.setItem("access_token", data.access);
};
```

---

このコードは、すべて関数として分けてあるので、`hooks`や`context`と組み合わせて状態管理に利用しやすいです。
必要であれば、React Context + SWR/Axiosなどとの統合パターンも解説できます。希望があれば教えてください。











## 余力があれば：Custom Middleware 実装

### 例：ログ記録や追加認証制限など

---

### ✅ カスタム認証ミドルウェアが必要になるのはどんな時？

以下のような**特殊な要件**がある場合に有効：

* トークンから特定のカスタムクレーム（例：ユーザータイプ）をチェックしたい
* 無効ユーザーに対するアクセス拒否のルールを厳密化したい
* すべてのリクエストに対してログやアクセス制限をかけたい（例：IP制限）
* 通常のJWT検証以外のロジックを差し込みたい
