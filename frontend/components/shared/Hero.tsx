import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-indigo-900 text-white overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-900/70"></div>
        <img
          src="/images/hero-japan.jpg"
          alt="日本の風景"
          className="w-full h-full object-cover"
        />
      </div>

      {/* コンテンツ */}
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            This is Japan
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-serif">
            日本の魅力を世界へ。写真と言葉と体験で日本を伝える。
          </p>
          <p className="mb-8 text-white/80">
            写真共有、日本語・文化の解説、体験の共有を通じて、日本の魅力を世界に伝えるプラットフォーム。
            言葉の壁を超えて、日本の文化や風景、日常を共有しましょう。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/photos" className="jp-button jp-button-accent">
              写真を見る
            </Link>
            <Link href="/words" className="jp-button border-2 border-white text-white hover:bg-white/10">
              言葉を学ぶ
            </Link>
            <Link href="/experiences" className="jp-button bg-white text-indigo-900 hover:bg-white/90">
              体験を探す
            </Link>
          </div>
        </div>
      </div>

      {/* 右下に小さな和柄パターン */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="jp-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="white" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#jp-pattern)" />
        </svg>
      </div>
    </div>
  );
};

export default Hero; 