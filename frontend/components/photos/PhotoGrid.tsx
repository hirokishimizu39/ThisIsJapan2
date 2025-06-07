import React from 'react';
import PhotoCard from './PhotoCard';

interface Photo {
  id: number;
  slug: string;
  title: string;
  imageUrl: string;
  author: string;
  location?: string;
  likes?: number;
}

interface PhotoGridProps {
  photos: Photo[];
  className?: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, className = '' }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">写真がありません。</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {photos.map((photo, index) => (
        <PhotoCard
          key={`photo-${photo.id}-${index}`}
          id={photo.id}
          slug={photo.slug}
          title={photo.title}
          imageUrl={photo.imageUrl}
          author={photo.author}
          location={photo.location}
          likes={photo.likes}
        />
      ))}
    </div>
  );
};

export default PhotoGrid; 