import { NextRequest, NextResponse } from 'next/server';

// Docker環境ではbackendコンテナ名を使用し、その他の環境ではNEXT_PUBLIC_API_URLを使用
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';

// ログイン処理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // デバッグ用 - 完全なリクエストボディ
    console.log('API Route - 受信データ (完全):', JSON.stringify(body));
    console.log('API Route - メールとパスワード:', { 
      email: body.email, 
      password: body.password ? '***' : undefined 
    });
    
    // APIにログインリクエストを送信
    const apiRequestBody = {
      email: body.email,
      password: body.password
    };
    
    console.log('API Route - バックエンドに送信するデータ:', { 
      ...apiRequestBody, 
      password: '***' 
    });
    
    const apiResponse = await fetch(`${API_URL}/api/v1/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });
    
    if (!apiResponse.ok) {
      const data = await apiResponse.json();
      console.error('API Route - バックエンドからのエラーレスポンス:', data);
      return NextResponse.json(
        { error: data.error || data.detail || 'ログインに失敗しました' },
        { status: apiResponse.status }
      );
    }
    
    const data = await apiResponse.json();
    console.log('API Route - バックエンドからの成功レスポンス:', { 
      ...data, 
      access: data.access ? '***' : undefined,
      refresh: data.refresh ? '***' : undefined
    });
    
    // JWTトークンをCookieに設定したレスポンスを作成
    const response = NextResponse.json({ success: true, user: data.user });
    
    if (data.access) {
      response.cookies.set({
        name: 'auth_token',
        value: data.access,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1週間
        sameSite: 'strict',
      });
    }
    
    if (data.refresh) {
      response.cookies.set({
        name: 'refresh_token',
        value: data.refresh,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30日
        sameSite: 'strict',
      });
    }
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}