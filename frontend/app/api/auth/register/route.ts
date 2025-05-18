import { NextRequest, NextResponse } from 'next/server';

// Docker環境ではbackendコンテナ名を使用し、その他の環境ではNEXT_PUBLIC_API_URLを使用
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // デバッグ用にリクエストボディを出力
    console.log('Route Handler受信データ:', body);
    console.log('Route Handler送信先:', `${API_URL}/api/v1/auth/register/`);
    
    // APIにユーザー登録リクエストを送信
    const response = await fetch(`${API_URL}/api/v1/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // デバッグ用にレスポンスを出力
    console.log('バックエンドレスポンス:', {
      status: response.status,
      data
    });
    
    if (!response.ok) {
      // エラーメッセージを整形
      let errorMessage = '登録に失敗しました';
      if (data) {
        // バックエンドのエラーメッセージを取得
        const errorDetails = Object.entries(data)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`;
            }
            return `${key}: ${value}`;
          })
          .join('; ');
        
        if (errorDetails) {
          errorMessage = `登録に失敗しました: ${errorDetails}`;
        }
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: data 
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'ユーザー登録が完了しました',
      user: data
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 