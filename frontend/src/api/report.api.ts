import axios from './axios.config';
import { ApiResponse } from '@/types';

export enum ReportReason {
  INAPPROPRIATE = 'INAPPROPRIATE',
  SPAM = 'SPAM',
  VIOLENCE = 'VIOLENCE',
  NUDITY = 'NUDITY',
  HATE_SPEECH = 'HATE_SPEECH',
  OTHER = 'OTHER',
}

export interface ReportPhotoRequest {
  reason: ReportReason;
  description?: string;
}

export const reportApi = {
  reportPhoto: async (photoId: number, data: ReportPhotoRequest): Promise<void> => {
    await axios.post(`/report/photo/${photoId}`, data);
  },
};