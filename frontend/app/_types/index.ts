// 전역 타입 정의

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// JWT 페이로드
export interface JWTPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

// 사용자 관련 타입
export type UserRole = 'USER' | 'MEMBER';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  userRoleId?: string;
}

export interface UserFormData {
  username: string;
  password?: string;
  role: UserRole;
  name?: string;
  email?: string;
  phoneNumber?: string;
  userRoleId?: string;
}

// 사이트 관련 타입
export interface Site {
  id: string;
  siteNm: string;
  siteTypeCd: string;
  siteTypeNm?: string;
  enabled: boolean;
  description?: string;
}

// 메뉴 관련 타입
export interface Menu {
  id: string;
  menuNm: string;
  menuPath: string;
  parentId?: string;
  siteId: string;
  siteNm?: string;
  iconId?: string;
  iconNm?: string;
  iconPath?: string;
  enabled: boolean;
  sortOrder?: number;
  description?: string;
}

// 아이콘 관련 타입
export interface Icon {
  id: string;
  iconNm: string;
  iconPath: string;
  description?: string;
}

// 공통코드 관련 타입
export interface CmnCd {
  id: string;
  cmnCdGrpId: string;
  cmnCd: string;
  cmnCdNm: string;
  cmnCdDesc?: string;
  sortOrder?: number;
  enabled: boolean;
  useYn?: string;
}

// 사용자 역할 관련 타입
export interface UserRole {
  id: string;
  roleNm: string;
  roleDesc?: string;
  enabled: boolean;
}

// 멤버 역할 관련 타입
export interface MemberRole {
  id: string;
  roleNm: string;
  roleDesc?: string;
  enabled: boolean;
}

// 메뉴 권한 관련 타입
export interface MenuPermissionItem {
  menuId: string;
  menuNm: string;
  menuPath: string;
  parentId?: string;
  siteId: string;
  siteNm: string;
  iconId?: string;
  iconPath?: string;
  enabled: boolean;
  hasPermission: boolean;
  sortOrder?: number;
}

export interface MenuPermissionResponse {
  success: boolean;
  message?: string;
  data?: MenuPermissionItem[];
}

export interface MenuTreeNode extends MenuPermissionItem {
  children?: MenuTreeNode[];
}

// 파일 관련 타입
export interface File {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

// 로그 관련 타입
export interface Log extends Record<string, unknown> {
  id: string;
  logType: string;
  message: string;
  createdAt: string;
}

export interface LogFormData {
  logType: string;
  message: string;
}

// 폼 관련 공통 타입
export interface SelectOption {
  value: string;
  label: string;
}
