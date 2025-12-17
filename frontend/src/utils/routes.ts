// Route paths constants
export const ROUTES = {
  // Public routes
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  
  // Protected user routes
  HOME: '/',
  CHAT: '/chat/:userId',
  FRIENDS: '/friends',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PHOTOS: '/admin/photos',
  ADMIN_LOGS: '/admin/logs',
} as const;

// Helper function to generate chat route with userId
export const getChatRoute = (userId: string | number): string => {
  return `/chat/${userId}`;
};

// Helper function to check if route is admin route
export const isAdminRoute = (path: string): boolean => {
  return path.startsWith('/admin');
};

// Helper function to check if route is public route
export const isPublicRoute = (path: string): boolean => {
  return path === ROUTES.SIGNUP || path === ROUTES.SIGNIN;
};
