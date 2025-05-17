"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">This is Japan</h3>
            <p className="text-indigo-200">日本の文化や体験を世界に発信するプラットフォーム</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">コンテンツ</h4>
            <ul className="space-y-2">
              <li><Link href="/photos" className="text-indigo-200 hover:text-white">写真</Link></li>
              <li><Link href="/words" className="text-indigo-200 hover:text-white">言葉</Link></li>
              <li><Link href="/experiences" className="text-indigo-200 hover:text-white">体験</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">プロジェクト</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-indigo-200 hover:text-white">プロジェクトについて</Link></li>
              <li><Link href="/contact" className="text-indigo-200 hover:text-white">お問い合わせ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">利用規約</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-indigo-200 hover:text-white">利用規約</Link></li>
              <li><Link href="/privacy" className="text-indigo-200 hover:text-white">プライバシーポリシー</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-indigo-800 mt-8 pt-8 text-center text-indigo-300">
          <p>&copy; {new Date().getFullYear()} This is Japan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 