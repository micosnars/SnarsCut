import React from 'react';

interface Props {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<Props> = ({ text, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      {text && (
        <p className="text-neon-blue font-medium animate-pulse tracking-wide text-sm md:text-base">
          {text}
        </p>
      )}
    </div>
  );
};