import React from 'react';
import PhotoGrid from '@/components/photos/PhotoGrid';
import SectionTitle from '@/components/shared/SectionTitle';
import { PhotoListResponse } from '@/lib/api/types/photo';

// API経由で写真データを取得する関数
async function getPhotos(): Promise<PhotoListResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/photos`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch photos');
  }
  
  return res.json();
}

export default async function PhotosPage() {
  // 写真データを取得
  const photosData = await getPhotos().catch(error => {
    console.error('Error loading photos:', error);
    return { results: [], count: 0, next: null, previous: null } as PhotoListResponse;
  });
  
  // UIに合わせたデータ形式に変換
  const photos = photosData.results.map(photo => ({
    id: Number(photo.id),
    title: photo.title,
    imageUrl: photo.image,
    author: photo.user.username,
    location: photo.location_name || '',
    likes: 0, // 本来はAPIから取得するデータ
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle 
        title="日本の魅力を写真で発見" 
        subtitle="日本全国から投稿された素晴らしい瞬間をご覧ください" 
        className="mb-8"
      />
      
      {/* フィルター/ソート機能 */}
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button className="jp-button-outline text-sm">すべて</button>
          <button className="jp-button-ghost text-sm">自然</button>
          <button className="jp-button-ghost text-sm">建築</button>
          <button className="jp-button-ghost text-sm">文化</button>
          <button className="jp-button-ghost text-sm">食べ物</button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">並び順:</span>
          <select className="border rounded py-1 px-2 text-sm">
            <option value="latest">最新順</option>
            <option value="popular">人気順</option>
            <option value="views">閲覧数順</option>
          </select>
        </div>
      </div>
      
      {/* 写真グリッド */}
      {photos.length > 0 ? (
        <PhotoGrid photos={photos} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">写真が見つかりませんでした。</p>
        </div>
      )}
      
      {/* ページネーション */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-1">
          <button className="jp-button-ghost px-3 py-1">前へ</button>
          <button className="jp-button-primary px-3 py-1">1</button>
          <button className="jp-button-ghost px-3 py-1">2</button>
          <button className="jp-button-ghost px-3 py-1">3</button>
          <button className="jp-button-ghost px-3 py-1">次へ</button>
        </div>
      </div>
    </div>
  );
} 