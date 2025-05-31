import React from 'react';
import ExperienceCard from './ExperienceCard';

interface Experience {
  id: number;
  title: string;
  imageUrl: string;
  location: string;
  description?: string;
  price?: string;
  author: string;
  likes?: number;
}

interface ExperienceGridProps {
  experiences: Experience[];
  className?: string;
}

const ExperienceGrid: React.FC<ExperienceGridProps> = ({ experiences, className = '' }) => {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">体験がありません。</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {experiences.map((experience, index) => (
        <ExperienceCard
          key={`experience-${experience.id}-${index}`}
          id={experience.id}
          title={experience.title}
          imageUrl={experience.imageUrl}
          location={experience.location}
          description={experience.description}
          price={experience.price}
          author={experience.author}
          likes={experience.likes}
        />
      ))}
    </div>
  );
};

export default ExperienceGrid; 