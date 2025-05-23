import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PhotoCardProps {
  id: number;
  title: string;
  imageUrl: string;
  author: string;
  location?: string;
  likes?: number;
  className?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  id,
  title,
  imageUrl,
  author,
  location,
  likes = 0,
  className = '',
}) => {
  return (
    <div className={`jp-card ${className}`}>
      <Link href={`/photos/${id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="p-4">
        <Link href={`/photos/${id}`} className="hover:text-indigo-700">
          <h3 className="font-serif font-medium text-lg mb-1 truncate">{title}</h3>
        </Link>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex flex-col">
            <span className="text-xs">{author}</span>
            {location && (
              <span className="text-xs text-gray-500">{location}</span>
            )}
          </div>
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

export default PhotoCard; 