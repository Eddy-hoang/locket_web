import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { CameraView } from '@/components/camera/CameraView';
import { PhotoPreview } from '@/components/camera/PhotoPreview';
import { FeedItem } from '@/components/feed/FeedItem';
import { photoApi } from '@/api/photo.api';
import { usePhotoStore } from '@/store/photoStore';
import { ChevronUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { feed, setFeed, currentIndex, setCurrentIndex, isLoading, setLoading } = usePhotoStore();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showFeedHint, setShowFeedHint] = useState(true);

  // Load feed
  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const photos = await photoApi.getFeed();
      setFeed(photos);
    } catch (error) {
      console.error('Load feed failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
  };

  const handleUploadSuccess = () => {
    setCapturedImage(null);
    loadFeed(); // Reload feed
  };
// xu li handle feed
  const handleScrollToFeed = () => {
    const feedElement = document.getElementById('feed-section');
    feedElement?.scrollIntoView({ behavior: 'smooth' });
    setShowFeedHint(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {capturedImage && (
        <PhotoPreview
          imageSrc={capturedImage}
          onCancel={() => setCapturedImage(null)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
      <div className="pt-16 pb-safe">
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <CameraView onCapture={handleCapture} />
          {feed.length > 0 && showFeedHint && (
            <button
              onClick={handleScrollToFeed}
              className="mt-8 flex flex-col items-center gap-2 text-primary hover:text-primary-dark transition-colors animate-bounce"
            >
              <ChevronUp className="w-6 h-6" />
              <span className="text-sm font-medium">
                Kéo lên để xem ảnh bạn bè
              </span>
            </button>
          )}
        </div>

        <div id="feed-section" className="min-h-screen bg-white">
          <div className="max-w-md mx-auto py-6">
            <h2 className="text-xl font-bold text-center mb-6">
              Ảnh của bạn bè
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : feed.length === 0 ? (
              <div className="text-center py-20 px-6">
                <p className="text-gray-500 mb-4">
                  Chưa có ảnh từ bạn bè
                </p>
                <p className="text-sm text-gray-400">
                  Hãy kết bạn và đăng ảnh để bắt đầu!
                </p>
              </div>
            ) : (
              <div className="space-y-6 px-4">
                {feed.map((photo) => (
                  <FeedItem key={photo.photoId} photo={photo} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};