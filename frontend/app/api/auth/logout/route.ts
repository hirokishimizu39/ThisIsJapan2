import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Docker環境ではbackendコンテナ名を使用し、その他の環境ではNEXT_PUBLIC_API_URLを使用
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // サーバーサイドでもログアウト処理を行う（トークンブラックリスト登録など）
    if (token) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        // バックエンドのログアウト処理が失敗しても、ローカルのクッキーは削除する
        console.error('Backend logout error:', err);
      }
    }

    // クッキーを削除
    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({ success: true, message: 'ログアウトしました' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'ログアウト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 