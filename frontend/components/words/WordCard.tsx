import React from 'react';
import Link from 'next/link';

interface WordCardProps {
  id: number;
  original: string;
  furigana?: string;
  translation: string;
  description?: string;
  author: string;
  likes?: number;
  className?: string;
}

const WordCard: React.FC<WordCardProps> = ({
  id,
  original,
  furigana,
  translation,
  description,
  author,
  likes = 0,
  className = '',
}) => {
  return (
    <div className={`jp-card ${className}`}>
      <div className="p-5">
        <Link href={`/words/${id}`} className="hover:text-indigo-700">
          <div className="mb-3">
            <h3 className="font-serif font-bold text-xl mb-1">{original}</h3>
            {furigana && (
              <p className="text-sm text-gray-500 mb-1">{furigana}</p>
            )}
            <p className="font-medium text-indigo-700">{translation}</p>
          </div>
        </Link>
        
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
          <span>{author}</span>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-500 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard; 