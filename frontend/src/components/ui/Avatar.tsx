import React from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
  const avatarUrl = src?.startsWith('http') 
    ? src 
    : `${apiUrl}/uploads/${src || 'default-avatar.png'}`;

  return (
    <div
      className={clsx(
        'rounded-full overflow-hidden bg-gray-200 flex-shrink-0',
        sizes[size],
        className
      )}
    >
      <img
        src={avatarUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/assets/default-avatar.png';
        }}
      />
    </div>
  );
};