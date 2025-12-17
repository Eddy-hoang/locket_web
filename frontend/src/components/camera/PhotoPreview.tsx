import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { photoApi } from '@/api/photo.api';
import { usePhotoStore } from '@/store/photoStore';
import { Button } from '@/components/ui/Button';

interface PhotoPreviewProps {
  imageSrc: string;
  onCancel: () => void;
  onUploadSuccess: () => void;
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  imageSrc,
  onCancel,
  onUploadSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const addPhoto = usePhotoStore((state) => state.addPhoto);

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      const photo = await photoApi.uploadPhoto(file);
      
      addPhoto({
        ...photo,
        reactions: [],
        reactionCount: {},
      });

      onUploadSuccess();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Không thể upload ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onCancel}
          disabled={isUploading}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-white font-medium">Preview</h2>
        <div className="w-10" />
      </div>

      {/* ảnh Preview */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full aspect-square rounded-2xl overflow-hidden">
          <img
            src={imageSrc}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* action button */}
      <div className="p-6 flex gap-4">
        <Button
          onClick={onCancel}
          variant="secondary"
          className="flex-1"
          disabled={isUploading}
        >
          <X className="w-5 h-5 mr-2" />
          Hủy
        </Button>
        <Button
          onClick={handleUpload}
          variant="primary"
          className="flex-1"
          disabled={isUploading}
        >
          {isUploading ? (
            <span>Đang tải...</span>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Đăng ảnh
            </>
          )}
        </Button>
      </div>
    </div>
  );
};