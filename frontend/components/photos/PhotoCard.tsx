'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PhotoCardProps {
  id: number;
  slug: string;
  title: string;
  imageUrl: string;
  author: string;
  location?: string;
  likes?: number;
  className?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  id,
  slug,
  title,
  imageUrl,
  author,
  location,
  likes = 0,
  className = '',
}) => {
  // 画像URLが有効かどうかを確認
  const isValidImageUrl = Boolean(imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/')));
  
  // フォールバック画像
  const fallbackImageUrl = '/images/placeholder-image.svg';
  
  // 使用する画像URL
  const finalImageUrl = isValidImageUrl ? imageUrl : fallbackImageUrl;
  
  return (
    <div className={`group jp-interactive ${className}`}>
      <Link href={`/photos/${slug}`} className="block">
        <article className="jp-card-elevated overflow-hidden h-full">
          {/* 画像エリア */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {finalImageUrl ? (
              <Image
                src={finalImageUrl}
                alt={title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImageUrl;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center jp-gradient-soft">
                <svg className="w-12 h-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* ホバー時のアクションボタン */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <div className="jp-card p-3 backdrop-blur-luxury">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            
            {/* いいね数インジケーター */}
            {likes > 0 && (
              <div className="absolute top-3 right-3 jp-card px-2 py-1 backdrop-blur-luxury">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-xs font-medium text-foreground">{likes}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* コンテンツエリア */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-serif font-semibold text-lg mb-1 text-foreground group-hover:gradient-text-primary transition-all duration-300 line-clamp-2">
                {title}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full jp-gradient-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{author}</span>
                </div>
                
                {location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs truncate max-w-20">{location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* アクションバー */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <button className="jp-button-ghost p-2 hover:jp-gradient-accent transition-all duration-300 group/btn">
                  <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                <button className="jp-button-ghost p-2 hover:jp-gradient-primary transition-all duration-300 group/btn">
                  <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
              
              <div className="text-xs text-muted-foreground font-medium">
                詳細を見る →
              </div>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default PhotoCard; 