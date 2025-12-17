import React, { useState } from 'react';
import { PhotoWithReactions } from '@/types';
import { reactionApi } from '@/api/reaction.api';
import { usePhotoStore } from '@/store/photoStore';
import { useAuthStore } from '@/store/authStore';

interface ReactionBarProps {
  photo: PhotoWithReactions;
}

const EMOJI_LIST = ['❤️', '😂', '👍', '😮', '😢'];

export const ReactionBar: React.FC<ReactionBarProps> = ({ photo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const updatePhotoReactions = usePhotoStore((state) => state.updatePhotoReactions);
  const currentUser = useAuthStore((state) => state.user);
  const userReaction = photo.reactions?.find( // check curent ... user...
    (r) => r.userId === currentUser?.userId
  );

  const handleReaction = async (emojiType: string) => {
    if (isLoading || !currentUser) return;

    setIsLoading(true);
    try {
      // Toggle reaction
      const result = await reactionApi.toggleReaction(photo.photoId, emojiType);
      let newReactions = [...(photo.reactions || [])];
      let newReactionCount = { ...photo.reactionCount };

      if (result) {
        newReactions.push(result);
        newReactionCount[emojiType] = (newReactionCount[emojiType] || 0) + 1;
        if (userReaction && userReaction.emojiType !== emojiType) {
          newReactions = newReactions.filter(r => r.reactionId !== userReaction.reactionId);
          newReactionCount[userReaction.emojiType] = Math.max(
            0,
            (newReactionCount[userReaction.emojiType] || 0) - 1
          );
        }
      } else {
        if (userReaction) {
          newReactions = newReactions.filter(r => r.reactionId !== userReaction.reactionId);
          newReactionCount[userReaction.emojiType] = Math.max(
            0,
            (newReactionCount[userReaction.emojiType] || 0) - 1
          );
        }
      }

      updatePhotoReactions(photo.photoId, {
        reactions: newReactions,
        reactionCount: newReactionCount,
      });
    } catch (error) {
      console.error('Reaction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {EMOJI_LIST.map((emoji) => {
        const count = photo.reactionCount?.[emoji] || 0;
        const isActive = userReaction?.emojiType === emoji;

        return (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            disabled={isLoading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
              isActive
                ? 'bg-primary text-white scale-110'
                : 'bg-gray-100 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            <span className="text-lg">{emoji}</span>
            {count > 0 && (
              <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};