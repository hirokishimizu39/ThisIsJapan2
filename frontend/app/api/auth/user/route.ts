import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Docker環境ではbackendコンテナ名を使用し、その他の環境ではNEXT_PUBLIC_API_URLを使用
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';

// ユーザープロフィールの更新
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // APIにプロフィール更新リクエストを送信
    const response = await fetch(`${API_URL}/api/v1/auth/user/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'プロフィールの更新に失敗しました', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 