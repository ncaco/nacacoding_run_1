// 전역 상수 정의

// API 관련 상수
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  MEMBERS: '/members',
  ADMINS: '/admins',
  SITES: '/sites',
  MENUS: '/menus',
  ICONS: '/icons',
  CMN_CD: '/cmn-cd',
  USER_ROLES: '/user-roles',
  MEMBER_ROLES: '/member-roles',
  FILES: '/files',
  LOGS: '/logs',
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'adminToken',
  ADMIN_REFRESH_TOKEN: 'adminRefreshToken',
  ADMIN_USERNAME: 'adminUsername',
  USER_ROLE: 'userRole',
  ADMIN_SIDEBAR_OPEN: 'adminSidebarOpen',
  ADMIN_SIDEBAR_COLLAPSED: 'adminSidebarCollapsed',
} as const;

// 토큰 갱신 관련 상수
export const TOKEN_REFRESH_BEFORE_EXPIRATION = 5 * 60 * 1000; // 5분 전

// 반응형 브레이크포인트
export const BREAKPOINTS = {
  MOBILE: 1024,
} as const;
