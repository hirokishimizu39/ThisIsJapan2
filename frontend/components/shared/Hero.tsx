import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden jp-pattern-overlay">
      {/* 背景装飾要素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full jp-gradient-primary opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full jp-gradient-accent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full jp-gradient-soft opacity-30 blur-2xl"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* 左側: テキストコンテンツ */}
          <div className="space-y-8 jp-animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full jp-card">
                <div className="w-2 h-2 rounded-full jp-gradient-accent"></div>
                <span className="text-sm font-medium text-muted-foreground">日本の魅力を世界へ</span>
              </div>
              
              <h1 className="jp-heading-1">
                This is Japan
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif">
                写真と言葉と体験で<br />
                日本の<span className="gradient-text-accent font-bold">美しさ</span>を伝える
              </p>
              
              <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed max-w-lg">
                言葉の壁を超えて、日本の文化や風景、日常の瞬間を世界と共有する
                モダンなプラットフォーム。一期一会の瞬間をデジタルで表現します。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/photos" className="jp-button jp-button-primary jp-interactive group">
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                写真を見る
              </Link>
              
              <Link href="/words" className="jp-button jp-button-outline jp-interactive group">
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                言葉を学ぶ
              </Link>
              
              <Link href="/experiences" className="jp-button jp-button-ghost jp-interactive group">
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                体験を探す
              </Link>
            </div>
          </div>
          
          {/* 右側: ビジュアルエリア */}
          <div className="relative jp-animate-slide-up">
            <div className="relative">
              {/* メイン画像カード */}
              <div className="jp-card-elevated p-2 backdrop-blur-luxury">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="美しい日本の風景"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>
              
              {/* フローティング統計カード */}
              <div className="absolute -top-6 -left-6 jp-card p-4 backdrop-blur-luxury jp-animate-scale-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg jp-gradient-primary flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold gradient-text-primary">1,000+</div>
                    <div className="text-xs text-muted-foreground">写真共有</div>
                  </div>
                </div>
              </div>
              
              {/* フローティング文化カード */}
              <div className="absolute -bottom-6 -right-6 jp-card p-4 backdrop-blur-luxury jp-animate-scale-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg jp-gradient-accent flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold gradient-text-accent">500+</div>
                    <div className="text-xs text-muted-foreground">言葉解説</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* スクロール指示 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 jp-animate-fade-in" style={{animationDelay: '1s'}}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">スクロールして詳細を見る</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 和風装飾要素 */}
      <div className="absolute top-20 right-20 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <pattern id="jp-pattern-hero" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#jp-pattern-hero)" />
        </svg>
      </div>
    </div>
  );
};

export default Hero; 