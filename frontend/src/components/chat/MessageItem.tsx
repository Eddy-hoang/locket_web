import React from 'react';
import { Message } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { formatTime } from '@/utils/helpers';
import { PhotoReplyItem } from './PhotoReplyItem';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const currentUser = useAuthStore((state) => state.user);
  const isSent = message.senderId === currentUser?.userId;
  if (message.messageType === 'PHOTO_REPLY') {
    return <PhotoReplyItem message={message} isSent={isSent} />;
  }

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isSent
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
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
  );
};