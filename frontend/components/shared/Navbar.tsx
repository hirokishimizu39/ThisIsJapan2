"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-white border-b-2 border-white pb-1' : 'text-indigo-200 hover:text-white';
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
          <ul className="flex flex-wrap justify-center md:justify-end space-x-1 md:space-x-4">
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
            <li className="mb-2 md:mb-0">
              <Link href="/auth/login" className="jp-button jp-button-accent">
                ログイン
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 