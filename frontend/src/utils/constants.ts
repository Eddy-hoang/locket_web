// API URLs
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

// Local Storage Keys
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

// Emoji reactions
export const EMOJI_REACTIONS = ['❤️', '😂', '👍', '😮', '😢'];

// Image settings
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_MESSAGE_PAGE_SIZE = 50;