import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl shadow-md overflow-hidden',
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
};