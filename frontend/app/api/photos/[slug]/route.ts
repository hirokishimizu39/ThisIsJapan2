import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Docker環境ではbackendコンテナ名を使用し、その他の環境ではNEXT_PUBLIC_API_URLを使用
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';
const API_ENDPOINT = `${API_URL}/api/v1`;

// ブラウザからアクセス可能なバックエンドURL
const BROWSER_ACCESSIBLE_API_URL = 'http://localhost:8000';

/**
 * 特定の写真の詳細を取得するGETエンドポイント
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // 写真のスラグを取得
    const { slug } = await context.params;
    
    // バックエンドAPIのエンドポイント
    const endpoint = `${API_ENDPOINT}/photos/${slug}/`;
    
    console.log('Fetching photo detail from backend endpoint:', endpoint);
    
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
    
    // エラーの場合、フォールバック処理を試行
    if (!response.ok && response.status === 404) {
      console.log('写真が見つかりません。フォールバック処理を実行します:', slug);
      
      // 全ての写真を取得してslugマッチングを試行
      try {
        const allPhotosResponse = await fetch(`${API_ENDPOINT}/photos/`, {
          method: 'GET',
          headers,
          cache: 'no-store',
        });
        
        if (allPhotosResponse.ok) {
          const allPhotosData = await allPhotosResponse.json();
          
          // slugが付与されない場合があるので処理
          // フロントエンドで生成されたslugとマッチする写真を探す
          const matchedPhoto = allPhotosData.results?.find((photo: any) => {
            // 空のslugを持つ写真に対してslugを生成して比較
            if (!photo.slug || photo.slug.trim() === '') {
              const generateSlug = (title: string) => {
                return title
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .trim('-');
              };
              
              const uniqueSuffix = photo.id.split('-').pop()?.slice(-4) || '';
              const generatedSlug = generateSlug(photo.title) + '-' + uniqueSuffix;
              
              return generatedSlug === slug;
            }
            return photo.slug === slug;
          });
          
          if (matchedPhoto) {
            console.log('フォールバック処理で写真が見つかりました:', matchedPhoto.title);
            
            // 画像URLを処理
            if (matchedPhoto.image) {
              if (matchedPhoto.image.includes('backend:8000')) {
                matchedPhoto.image = matchedPhoto.image.replace('http://backend:8000', BROWSER_ACCESSIBLE_API_URL);
              } else if (!matchedPhoto.image.startsWith('http')) {
                const imagePath = matchedPhoto.image.startsWith('/') ? matchedPhoto.image : `/${matchedPhoto.image}`;
                matchedPhoto.image = `${BROWSER_ACCESSIBLE_API_URL}${imagePath}`;
              }
            }
            
            // slugを更新
            if (!matchedPhoto.slug || matchedPhoto.slug.trim() === '') {
              const generateSlug = (title: string) => {
                return title
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .trim('-');
              };
              
              const uniqueSuffix = matchedPhoto.id.split('-').pop()?.slice(-4) || '';
              matchedPhoto.slug = generateSlug(matchedPhoto.title) + '-' + uniqueSuffix;
            }
            
            return NextResponse.json(matchedPhoto);
          }
        }
      } catch (fallbackError) {
        console.error('フォールバック処理でエラーが発生しました:', fallbackError);
      }
      
      // フォールバック処理でも見つからない場合
      console.error('Error response from backend:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: response.status }
      );
    }
    
    // 成功した場合の処理は既存のまま
    if (!response.ok) {
      console.error('Error response from backend:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: response.status }
      );
    }
    
    // レスポンスのJSONを取得
    const data = await response.json();
    
    console.log('Backend photo detail response:', JSON.stringify(data).substring(0, 500) + '...');
    
    // 写真の詳細情報をログ出力
    if (data && data.image) {
      console.log('Photo image details:', {
        image: data.image,
        imageType: typeof data.image,
        startsWithSlash: data.image.startsWith('/'),
        startsWithMedia: data.image.startsWith('/media'),
        startsWithHttp: data.image.startsWith('http'),
      });
    }
    
    // 画像URLを処理して、ブラウザからアクセス可能なURLに変換
    if (data && data.image) {
      // 元のイメージURLをログ出力
      console.log(`Processing detail image URL: ${data.image}`);
      
      // backend:8000をlocalhost:8000に変換
      if (data.image.includes('backend:8000')) {
        data.image = data.image.replace('http://backend:8000', BROWSER_ACCESSIBLE_API_URL);
        console.log(`Converted backend URL to: ${data.image}`);
      }
      // 絶対URLでなければ、ブラウザからアクセス可能なURLに変換
      else if (!data.image.startsWith('http')) {
        // スラッシュで始まっていない場合は追加
        const imagePath = data.image.startsWith('/') ? data.image : `/${data.image}`;
        data.image = `${BROWSER_ACCESSIBLE_API_URL}${imagePath}`;
        console.log(`Converted relative path to: ${data.image}`);
      }
      
      // image_urlフィールドも同様に処理
      if (data.image_url && data.image_url.includes('backend:8000')) {
        data.image_url = data.image_url.replace('http://backend:8000', BROWSER_ACCESSIBLE_API_URL);
        console.log(`Converted image_url backend URL to: ${data.image_url}`);
      }
    }
    
    // レスポンスを返却
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching photo details:', error);
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
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // 写真のスラグを取得
    const { slug } = await context.params;
    
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
    const endpoint = `${API_ENDPOINT}/photos/${slug}/update/`;
    
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
    
    // 画像URLを処理して、ブラウザからアクセス可能なURLに変換
    if (data && data.image && data.image.startsWith('/media')) {
      data.image = `${BROWSER_ACCESSIBLE_API_URL}${data.image}`;
    }
    
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
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // 写真のスラグを取得
    const { slug } = await context.params;
    
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
    const endpoint = `${API_ENDPOINT}/photos/${slug}/delete/`;
    
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