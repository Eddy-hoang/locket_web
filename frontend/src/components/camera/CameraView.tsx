import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-square bg-black rounded-2xl overflow-hidden shadow-xl">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: 'user',
            aspectRatio: 1,
          }}
          onUserMedia={() => setHasPermission(true)}
          onUserMediaError={() => setHasPermission(false)}
          className="w-full h-full object-cover"
        />

        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-6 text-center">
            <div>
              <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                Không thể truy cập camera
              </p>
              <p className="text-sm text-gray-400">
                Vui lòng cho phép truy cập camera trong cài đặt trình duyệt
              </p>
            </div>
          </div>
        )}
      </div>
      
      {hasPermission && (
        <div className="flex justify-center mt-6">
          <button
            onClick={capture}
            className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
            aria-label="Chụp ảnh"
          >
            <div className="w-full h-full rounded-full bg-primary" />
          </button>
        </div>
      )}
    </div>
  );
};