import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PhotoWithReactions } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ReactionBar } from './ReactionBar';
import { ReportButton } from './ReportButton';
import { formatDistanceToNow } from '@/utils/helpers';
import { getChatRoute } from '@/utils/routes';

interface FeedItemProps {
  photo: PhotoWithReactions;
}

export const FeedItem: React.FC<FeedItemProps> = ({ photo }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
  const imageUrl = photo.imageUrl.startsWith('http')
    ? photo.imageUrl
    : `${apiUrl}/uploads/${photo.imageUrl}`;

  const handleSendMessage = () => {
    navigate(getChatRoute(photo.userId), {
      state: { photoId: photo.photoId },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* User Info */}
      <div className="flex items-center gap-3 p-4">
        <Avatar src={photo.user?.avatar} size="md" />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{photo.user?.name || 'Unknown'}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(photo.createdAt)}
          </p>
        </div>
      </div>

      {/* Photo */}
      <div className="relative aspect-square bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageUrl}
          alt="Photo"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.error('Image load error:', photo.imageUrl);
            e.currentTarget.src = '/assets/placeholder.png';
          }}
        />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        {/* Reaction Bar */}
        <ReactionBar photo={photo} />

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Send Message Button */}
          <button
            onClick={handleSendMessage}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-gray-700" />
            <span className="font-medium text-gray-700">Gửi tin nhắn</span>
          </button>

          {/* Report Button */}
          <ReportButton photoId={photo.photoId} />
        </div>
      </div>
    </div>
  );
};