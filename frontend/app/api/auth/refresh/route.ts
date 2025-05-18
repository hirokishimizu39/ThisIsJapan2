import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Docker環境ではbackendコンテナ名を使用し、その他の環境ではNEXT_PUBLIC_API_URLを使用
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'リフレッシュトークンがありません' },
        { status: 401 }
      );
    }
    
    // APIにリフレッシュトークンを送信して新しいアクセストークンを取得
    const response = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // リフレッシュトークンが無効な場合はクッキーを削除
      cookieStore.delete('auth_token');
      cookieStore.delete('refresh_token');
      
      return NextResponse.json(
        { error: 'トークンのリフレッシュに失敗しました' },
        { status: response.status }
      );
    }
    
    // 新しいアクセストークンをCookieに保存
    cookieStore.set({
      name: 'auth_token',
      value: data.access,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1週間
      sameSite: 'strict',
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 