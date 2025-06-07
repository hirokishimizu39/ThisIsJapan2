import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
  animated?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  className = '',
  centered = true,
  animated = true
}) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''} ${animated ? 'jp-animate-fade-in' : ''} ${className}`}>
      <h2 className="jp-section-title">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground/80 text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle; 