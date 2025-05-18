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
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 text-white flex-col justify-center items-center p-12 relative">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">This is Japan</span>
          </Link>
        </div>
        
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">{title}</h1>
          <p className="text-lg mb-8">{description}</p>
          
          <div className="relative w-full h-64 my-8">
            <Image
              src="/images/auth-illustration.svg" 
              alt="日本の風景イラスト"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain"
              priority
            />
          </div>
          
          <div className="mt-12">
            <p className="text-sm opacity-80">
              「This is Japan」は日本の魅力を世界に発信するプラットフォームです。
              写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を伝えていきます。
            </p>
          </div>
        </div>
      </div>
      
      {/* 右側のフォームエリア */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold">This is Japan</span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">{title}</h1>
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