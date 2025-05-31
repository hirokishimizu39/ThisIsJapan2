import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoDetail } from '@/lib/api/types/photo';
import { notFound } from 'next/navigation';

// 写真詳細を取得するサーバーコンポーネント関数
async function getPhotoDetail(slug: string): Promise<PhotoDetail> {
  // サーバーサイドのリクエストはNext.jsのAPIルートを経由してバックエンドにアクセス
  const origin = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const res = await fetch(`${origin}/api/photos/${slug}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch photo details');
  }
  
  return res.json();
}

// 日付をフォーマットする関数
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // paramsを非同期で解決
  const { slug } = await params;
  
  // 写真の詳細情報を取得
  const photo = await getPhotoDetail(slug).catch(error => {
    console.error('Error loading photo details:', error);
    return null;
  });
  
  // 写真が見つからない場合
  if (!photo) {
    notFound();
  }

  // バックエンドのベースURLを取得（フロントエンドからアクセス可能なURL）
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('http://backend:8000', 'http://localhost:8000') || 'http://localhost:8000';
  
  // 画像URLの修正
  const imageUrl = photo.image?.startsWith('http') ? photo.image : `${backendUrl}${photo.image || ''}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <div className="text-sm mb-6">
        <Link href="/photos" className="text-gray-500 hover:underline">写真一覧</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800">{photo.title}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側: 写真表示エリア */}
        <div className="lg:col-span-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
          
          {/* 写真情報 */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">{photo.title}</h1>
            <div className="flex items-center mt-2 text-gray-500">
              <span>投稿者: {photo.user.username}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(photo.created_at)}</span>
              <span className="mx-2">•</span>
              <span>閲覧数: {photo.views_count}</span>
            </div>
          </div>
          
          {/* 説明 */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">写真について</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {photo.description || '説明はありません。'}
            </div>
          </div>
          
          {/* 位置情報 */}
          {photo.location_name && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">撮影場所</h2>
              <div className="text-gray-700">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{photo.location_name}</span>
                </div>
                
                {/* ここにGoogle Mapなどを表示することも可能 */}
                {photo.latitude && photo.longitude && (
                  <div className="mt-3 bg-gray-100 rounded-lg p-4 text-center">
                    地図プレビュー (緯度: {photo.latitude}, 経度: {photo.longitude})
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* 右側: サイドバー */}
        <div className="lg:col-span-4">
          {/* いいね・ブックマークボタン */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex justify-around">
              <button className="flex flex-col items-center text-gray-700 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="mt-1 text-sm">いいね</span>
              </button>
              
              <button className="flex flex-col items-center text-gray-700 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="mt-1 text-sm">保存</span>
              </button>
              
              <button className="flex flex-col items-center text-gray-700 hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="mt-1 text-sm">共有</span>
              </button>
            </div>
          </div>
          
          {/* 投稿者情報 */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">投稿者</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                {photo.user.profile_image ? (
                  <Image
                    src={photo.user.profile_image}
                    alt={photo.user.username}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{photo.user.username}</div>
                <div className="text-gray-500 text-sm">
                  {/* ここにユーザーの詳細情報を表示することも可能 */}
                </div>
              </div>
            </div>
          </div>
          
          {/* タグ */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="bg-white rounded-lg border p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/photos?tag=${tag.id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full px-3 py-1"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* カテゴリ */}
          {photo.category && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">カテゴリ</h3>
              <Link
                href={`/photos?category=${photo.category.id}`}
                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-4 py-2"
              >
                {photo.category.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 