import { create } from 'zustand';
import { PhotoWithReactions } from '@/types';

interface PhotoState {
  feed: PhotoWithReactions[];
  currentIndex: number;
  isLoading: boolean;
  
  setFeed: (photos: PhotoWithReactions[]) => void;
  addPhoto: (photo: PhotoWithReactions) => void;
  setCurrentIndex: (index: number) => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
  setLoading: (loading: boolean) => void;
  updatePhotoReactions: (photoId: number, reactions: any) => void;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  feed: [],
  currentIndex: 0,
  isLoading: false,

  setFeed: (photos) => set({ feed: photos, currentIndex: 0 }),
  
  addPhoto: (photo) => set((state) => ({ 
    feed: [photo, ...state.feed] 
  })),
  
  setCurrentIndex: (index) => set({ currentIndex: index }),
  
  nextPhoto: () => set((state) => ({
    currentIndex: Math.min(state.currentIndex + 1, state.feed.length - 1)
  })),
  
  prevPhoto: () => set((state) => ({
    currentIndex: Math.max(state.currentIndex - 1, 0)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),

  updatePhotoReactions: (photoId, reactions) => set((state) => ({
    feed: state.feed.map(photo => 
      photo.photoId === photoId 
        ? { ...photo, reactions: reactions.reactions, reactionCount: reactions.reactionCount }
        : photo
    )
  })),
}));