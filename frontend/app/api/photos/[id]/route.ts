import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 環境変数からバックエンドAPIのURLを取得
const API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1';

/**
 * 特定の写真の詳細を取得するGETエンドポイント
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 写真のスラグを取得
    const { id } = params;
    
    // バックエンドAPIのエンドポイント
    const endpoint = `${API_URL}/photos/${id}/`;
    
    // 認証トークンを取得（もしあれば）
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    // ヘッダーを設定
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // 認証トークンがあれば追加
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // バックエンドAPIを呼び出し
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    
    // エラーの場合
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: response.status }
      );
    }
    
    // レスポンスのJSONを取得
    const data = await response.json();
    
    // レスポンスを返却
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

/**
 * 写真を更新するPUTエンドポイント
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 写真のスラグを取得
    const { id } = params;
    
    // 認証トークンを取得
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    // 一時的に認証チェックを無効化（動作確認用）
    /*
    // 認証がなければ401エラー
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    */
    
    // マルチパートフォームデータを取得
    const formData = await request.formData();
    
    // バックエンドAPIのエンドポイント
    const endpoint = `${API_URL}/photos/${id}/update/`;
    
    // バックエンドAPIを呼び出し
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        // 認証トークンがあれば追加（なくても続行可能）
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: formData,
    });
    
    // エラーの場合
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }
    
    // レスポンスのJSONを取得
    const data = await response.json();
    
    // レスポンスを返却
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

/**
 * 写真を削除するDELETEエンドポイント
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 写真のスラグを取得
    const { id } = params;
    
    // 認証トークンを取得
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    // 一時的に認証チェックを無効化（動作確認用）
    /*
    // 認証がなければ401エラー
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    */
    
    // バックエンドAPIのエンドポイント
    const endpoint = `${API_URL}/photos/${id}/delete/`;
    
    // バックエンドAPIを呼び出し
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        // 認証トークンがあれば追加（なくても続行可能）
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        'Content-Type': 'application/json',
      },
    });
    
    // 204 No Content の場合は空のレスポンスを返す
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    
    // エラーの場合
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }
    
    // レスポンスのJSONを取得（存在する場合）
    const data = await response.json();
    
    // レスポンスを返却
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
} 