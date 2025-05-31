// Configuration de l'API
export const API_URL = process.env.REACT_APP_API_URL || 'https://campus-connect-api.onrender.com/api';
export const AUTH_API_URL = process.env.REACT_APP_API_URL || 'https://campus-connect-api.onrender.com/api/auth';

// Configuration des tokens
export const TOKEN_STORAGE_KEY = 'token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

// Configuration des routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  JOBS: '/jobs',
  JOB_DETAILS: '/jobs/:id',
  APPLICATIONS: '/applications',
  EVENTS: '/events',
  EVENT_DETAILS: '/events/:id',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  DASHBOARD: '/dashboard'
};

// Autres configurations
export const PAGINATION_LIMIT = 10;
export const DEFAULT_AVATAR = '/assets/default-avatar.png';
