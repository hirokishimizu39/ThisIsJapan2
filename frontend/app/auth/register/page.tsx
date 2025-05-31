'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左側のプロモーションエリア */}
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
      
      {/* 右側のフォームエリア */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="md:hidden mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-indigo-900">This is Japan</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2 text-gray-900">アカウント登録</h1>
          <p className="text-gray-600 mb-8">新しいアカウントを作成して、日本の魅力を世界と共有しましょう</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} This is Japan. All rights reserved.
        </div>
      </div>
    </div>
  );
} 