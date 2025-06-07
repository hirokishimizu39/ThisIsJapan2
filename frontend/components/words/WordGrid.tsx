import React from 'react';
import WordCard from './WordCard';

interface Word {
  id: number;
  original: string;
  furigana?: string;
  translation: string;
  description?: string;
  author: string;
  likes?: number;
}

interface WordGridProps {
  words: Word[];
  className?: string;
}

const WordGrid: React.FC<WordGridProps> = ({ words, className = '' }) => {
  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">言葉がありません。</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {words.map((word, index) => (
        <WordCard
          key={`word-${word.id}-${index}`}
          id={word.id}
          original={word.original}
          furigana={word.furigana}
          translation={word.translation}
          description={word.description}
          author={word.author}
          likes={word.likes}
        />
      ))}
    </div>
  );
};

export default WordGrid; 