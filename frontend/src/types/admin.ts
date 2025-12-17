// ==================== ADMIN DASHBOARD ====================
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalPhotos: number;
  reportedPhotos: number;
}

// ==================== PHOTO REPORT ====================
export interface PhotoReport {
  reportId: number;
  photoId: number;
  photoUrl: string;
  reporterId: number;
  reporterName: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  reviewedBy?: number;
  reviewedAt?: string;
}

export enum ReportReason {
  INAPPROPRIATE = 'INAPPROPRIATE',
  SPAM = 'SPAM',
  VIOLENCE = 'VIOLENCE',
  NUDITY = 'NUDITY',
  HATE_SPEECH = 'HATE_SPEECH',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

// ==================== ADMIN LOG ====================
export interface AdminLog {
  logId: number;
  adminName: string;
  action: AdminAction;
  targetType: TargetType;
  targetId: number;
  reason?: string;
  createdAt: string;
}

export enum AdminAction {
  BAN_USER = 'BAN_USER',
  UNBAN_USER = 'UNBAN_USER',
  DELETE_PHOTO = 'DELETE_PHOTO',
  DELETE_USER = 'DELETE_USER',
  DISMISS_REPORT = 'DISMISS_REPORT',
  RESOLVE_REPORT = 'RESOLVE_REPORT',
}

export enum TargetType {
  USER = 'USER',
  PHOTO = 'PHOTO',
  REPORT = 'REPORT',
}

// ==================== ADMIN REQUESTS ====================
export interface BanUserRequest {
  reason: string;
}

export interface DeletePhotoRequest {
  reason: string;
}

export interface ReportPhotoRequest {
  reason: ReportReason;
  description?: string;
}