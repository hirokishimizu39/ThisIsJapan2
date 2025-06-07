import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Docker環境ではbackendコンテナ名を使用し、その他の環境ではNEXT_PUBLIC_API_URLを使用
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';

// ログイン処理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // APIにログインリクエストを送信
    const response = await fetch(`${API_URL}/api/v1/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'ログインに失敗しました' },
        { status: response.status }
      );
    }
    
    // JWTトークンをCookieに保存
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: data.access,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1週間
      sameSite: 'strict',
    });
    
    if (data.refresh) {
      cookieStore.set({
        name: 'refresh_token',
        value: data.refresh,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30日
        sameSite: 'strict',
      });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// ユーザー情報取得処理
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }
    
    // APIからユーザー情報を取得
    const response = await fetch(`${API_URL}/api/v1/auth/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // トークンが無効な場合はクッキーを削除
      if (response.status === 401) {
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');
        cookieStore.delete('refresh_token');
      }
      
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: response.status }
      );
    }
    
    const userData = await response.json();
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 