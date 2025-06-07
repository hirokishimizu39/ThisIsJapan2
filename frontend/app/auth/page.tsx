'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左側: 認証フォーム */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* モバイル用ヘッダー */}
          <div className="md:hidden mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-indigo-900">This is Japan</span>
            </Link>
          </div>

          {/* 登録完了メッセージ */}
          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              登録が完了しました。ログインしてください。
            </div>
          )}

          {/* タブナビゲーション */}
          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ログイン
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                新規登録
              </button>
            </div>
          </div>

          {/* フォームコンテンツ */}
          <div className="min-h-[400px]">
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} This is Japan. All rights reserved.
        </div>
      </div>

      {/* 右側: ヒーローセクション */}
      <div className="hidden md:flex md:w-1/2 bg-slate-100 dark:bg-slate-900 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/50 to-indigo-900/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e')] bg-cover bg-center"></div>
        <div className="z-20 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-4">日本を探る</h1>
          <h2 className="text-xl font-semibold mb-8">Explore Japan</h2>
          <p className="mb-6">
            Join our community to share and discover the beauty, culture, and wisdom of Japan.
          </p>
          <div className="text-sm opacity-75">
            Share photos, cultural experiences, and meaningful Japanese phrases
          </div>
        </div>
      </div>
    </div>
  );
} 