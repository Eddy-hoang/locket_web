import { useState, useEffect } from 'react';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      setError(null);
    } catch (err: any) {
      console.error('Camera permission error:', err);
      setHasPermission(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Bạn đã từ chối quyền truy cập camera. Vui lòng cấp quyền trong cài đặt trình duyệt.');
      } else if (err.name === 'NotFoundError') {
        setError('Không tìm thấy camera. Vui lòng kiểm tra kết nối camera.');
      } else {
        setError('Không thể truy cập camera. Vui lòng thử lại.');
      }
    }
  };

  return {
    hasPermission,
    error,
    requestCameraPermission,
  };
};