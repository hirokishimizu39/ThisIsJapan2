'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左側のプロモーションエリア */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* 背景画像 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
            alt="美しい日本の風景"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
          {/* グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-indigo-900/80 to-indigo-900/70"></div>
        </div>
        
        <div className="absolute top-8 left-8 z-10">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white drop-shadow-lg">This is Japan</span>
          </Link>
        </div>
        
        <div className="max-w-md text-center relative z-10">
          <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">{title}</h1>
          <p className="text-lg mb-8 drop-shadow-md">{description}</p>
          
          <div className="mt-12">
            <p className="text-sm opacity-90 drop-shadow-md">
              「This is Japan」は日本の魅力を世界に発信するプラットフォームです。
              写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を伝えていきます。
            </p>
          </div>
        </div>
        
        {/* 和風装飾パターン */}
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="jp-pattern-auth" patternUnits="userSpaceOnUse" width="20" height="20">
              <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#jp-pattern-auth)" />
          </svg>
        </div>
      </div>
      
      {/* 右側のフォームエリア */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-indigo-900">This is Japan</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2 text-gray-900">{title}</h1>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>
        
        {children}
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} This is Japan. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 