import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ExperienceCardProps {
  id: number;
  title: string;
  imageUrl: string;
  location: string;
  description?: string;
  price?: string;
  author: string;
  likes?: number;
  className?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  id,
  title,
  imageUrl,
  location,
  description,
  price,
  author,
  likes = 0,
  className = '',
}) => {
  return (
    <div className={`jp-card ${className}`}>
      <Link href={`/experiences/${id}`} className="block relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {price && (
          <div className="absolute top-2 right-2 bg-white/90 text-indigo-900 px-2 py-1 text-sm font-medium rounded-sm">
            {price}
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link href={`/experiences/${id}`} className="hover:text-indigo-700">
          <h3 className="font-serif font-medium text-lg mb-1 truncate">{title}</h3>
        </Link>
        <p className="text-sm text-gray-700 mb-2 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1 text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </p>
        
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
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

export default ExperienceCard; 