import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { reportApi, ReportReason } from '@/api/report.api';

interface ReportButtonProps {
  photoId: number;
}

export const ReportButton: React.FC<ReportButtonProps> = ({ photoId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  const reasons = [
    { value: ReportReason.INAPPROPRIATE, label: 'Nội dung không phù hợp' },
    { value: ReportReason.SPAM, label: 'Spam' },
    { value: ReportReason.VIOLENCE, label: 'Bạo lực' },
    { value: ReportReason.NUDITY, label: 'Khỏa thân' },
    { value: ReportReason.HATE_SPEECH, label: 'Ngôn từ thù hận' },
    { value: ReportReason.OTHER, label: 'Khác' },
  ];

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      await reportApi.reportPhoto(photoId, {
        reason: selectedReason,
        description: description || undefined,
      });

      setHasReported(true);
      setIsModalOpen(false);
      alert('Báo cáo đã được gửi. Cảm ơn bạn!');
    } catch (error: any) {
      console.error('Report failed:', error);
      if (error.response?.data?.message?.includes('already reported')) {
        alert('Bạn đã báo cáo ảnh này rồi');
        setHasReported(true);
      } else {
        alert('Không thể gửi báo cáo. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasReported) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed"
      >
        <AlertTriangle className="w-4 h-4" />
        Đã báo cáo
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <AlertTriangle className="w-4 h-4" />
        Báo cáo
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Báo cáo ảnh"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Vui lòng chọn lý do báo cáo:
          </p>

          <div className="space-y-2">
            {reasons.map((reason) => (
              <label
                key={reason.value}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm">{reason.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả thêm (tuỳ chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nếu bạn muốn cung cấp thêm thông tin..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="danger"
              className="flex-1"
              disabled={!selectedReason || isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};