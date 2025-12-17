import React from 'react';
import { Message } from '@/types';
import { formatTime } from '@/utils/helpers';

interface PhotoReplyItemProps {
  message: Message;
  isSent: boolean;
}

export const PhotoReplyItem: React.FC<PhotoReplyItemProps> = ({
  message,
  isSent,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
  const photoUrl = message.photo?.imageUrl
    ? message.photo.imageUrl.startsWith('http')
      ? message.photo.imageUrl
      : `${apiUrl}/uploads/${message.photo.imageUrl}`
    : null;

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl overflow-hidden ${
          isSent
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {photoUrl && (
          <div className="relative w-48 h-48">
            <img
              src={photoUrl}
              alt="Photo reply"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                Replied to photo
              </span>
            </div>
          </div>
        )}

        <div className="px-4 py-2">
          <p className="text-sm break-words">{message.content}</p>
          <p
            className={`text-xs mt-1 ${
              isSent ? 'text-white/70' : 'text-gray-500'
            }`}
          >
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};