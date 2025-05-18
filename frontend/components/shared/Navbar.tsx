"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-white border-b-2 border-white pb-1' : 'text-indigo-200 hover:text-white';
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  return (
    <header className="bg-indigo-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="font-serif text-2xl font-bold">
            This is Japan
          </Link>
        </div>
        
        <nav className="w-full md:w-auto">
          <ul className="flex flex-wrap justify-center md:justify-end space-x-1 md:space-x-4 items-center">
            <li className="mb-2 md:mb-0">
              <Link href="/" className={`px-2 py-1 ${isActive('/')}`}>
                ホーム
              </Link>
            </li>
            <li className="mb-2 md:mb-0">
              <Link href="/photos" className={`px-2 py-1 ${isActive('/photos')}`}>
                写真
              </Link>
            </li>
            <li className="mb-2 md:mb-0">
              <Link href="/words" className={`px-2 py-1 ${isActive('/words')}`}>
                言葉
              </Link>
            </li>
            <li className="mb-2 md:mb-0">
              <Link href="/experiences" className={`px-2 py-1 ${isActive('/experiences')}`}>
                体験
              </Link>
            </li>
            <li className="mb-2 md:mb-0">
              <Link href="/about" className={`px-2 py-1 ${isActive('/about')}`}>
                プロジェクトについて
              </Link>
            </li>
            
            {/* 認証状態による表示切り替え */}
            {isAuthenticated ? (
              <li className="mb-2 md:mb-0 relative">
                <button 
                  onClick={toggleUserMenu} 
                  className="flex items-center px-2 py-1 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-300 mr-2">
                    {user?.profile_image ? (
                      <Image 
                        src={user.profile_image} 
                        alt={user.username} 
                        width={32} 
                        height={32}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white">
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="hidden md:inline-block">
                    {user?.username}
                  </span>
                </button>
                
                {/* ユーザーメニュー */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ダッシュボード
                    </Link>
                    <Link 
                      href="/photos/new" 
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      写真投稿
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      設定
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }} 
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="mb-2 md:mb-0">
                  <Link href="/auth/login" className="jp-button-ghost px-4 py-1 border border-indigo-200 rounded">
                    ログイン
                  </Link>
                </li>
                <li className="mb-2 md:mb-0 ml-2">
                  <Link href="/auth/register" className="jp-button-accent">
                    新規登録
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 