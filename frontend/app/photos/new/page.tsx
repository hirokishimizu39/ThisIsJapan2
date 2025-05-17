'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/shared/SectionTitle';
import Image from 'next/image';
import { PhotoCreateRequest } from '@/lib/api/types/photo';

export default function NewPhotoPage() {
  const router = useRouter();
  
  // フォームの状態
  const [formData, setFormData] = useState<Partial<PhotoCreateRequest>>({
    title: '',
    description: '',
  });
  
  // 画像プレビュー用の状態
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  
  // エラー状態
  const [error, setError] = useState<string | null>(null);
  
  // 入力フィールドの変更ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 画像選択ハンドラ
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 画像ファイルかチェック
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルを選択してください');
        return;
      }
      
      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        setError('ファイルサイズは5MB以下にしてください');
        return;
      }
      
      // プレビュー用のURL生成
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // 選択したファイルをセット
      setSelectedFile(file);
      setError(null);
    }
  };
  
  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.title) {
      setError('タイトルを入力してください');
      return;
    }
    
    if (!selectedFile) {
      setError('画像を選択してください');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // FormDataの作成
      const submitData = new FormData();
      submitData.append('title', formData.title || '');
      submitData.append('description', formData.description || '');
      
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }
      
      if (formData.location_name) {
        submitData.append('location_name', formData.location_name);
      }
      
      if (formData.latitude) {
        submitData.append('latitude', formData.latitude.toString());
      }
      
      if (formData.longitude) {
        submitData.append('longitude', formData.longitude.toString());
      }
      
      // APIリクエスト
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: submitData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '写真のアップロードに失敗しました');
      }
      
      // 成功したら写真一覧ページに遷移
      router.push('/photos');
      router.refresh(); // ページを更新して最新の写真を表示
      
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err instanceof Error ? err.message : '写真のアップロードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle 
        title="新しい写真を投稿" 
        subtitle="日本の美しい瞬間を共有しましょう" 
        className="mb-8"
      />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* 画像アップロード */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            写真
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {imagePreview ? (
              <div className="relative w-full aspect-video mb-4">
                <Image
                  src={imagePreview}
                  alt="写真プレビュー"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="py-8 text-gray-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  suppressHydrationWarning
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-1">ここにファイルをドラッグ&ドロップするか</p>
              </div>
            )}
            
            <label className="inline-block jp-button-primary cursor-pointer">
              <span>写真を選択</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
            <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF, 最大5MB</p>
          </div>
        </div>
        
        {/* タイトル */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            タイトル
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            required
          />
        </div>
        
        {/* 説明 */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          />
        </div>
        
        {/* 撮影場所 */}
        <div className="mb-6">
          <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-2">
            撮影場所
          </label>
          <input
            type="text"
            id="location_name"
            name="location_name"
            value={formData.location_name || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            placeholder="例：東京都渋谷区"
          />
        </div>
        
        {/* 送信ボタン */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="jp-button-ghost mr-2"
            disabled={isLoading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="jp-button-primary"
            disabled={isLoading}
          >
            {isLoading ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </form>
    </div>
  );
} 