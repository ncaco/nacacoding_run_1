// JWT 토큰 디코딩 유틸리티
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// 토큰 만료 확인
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const expirationTime = decoded.exp * 1000; // 초를 밀리초로 변환
  const now = Date.now();
  
  return now >= expirationTime;
}

// 토큰 만료까지 남은 시간 (밀리초)
export function getTokenExpirationTime(token: string | null): number | null {
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;
  
  const expirationTime = decoded.exp * 1000; // 초를 밀리초로 변환
  return expirationTime;
}

// 로그아웃 처리
export function logout(router: any) {
  // 로컬 스토리지에서 토큰 및 사용자 정보 제거
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsername');
  localStorage.removeItem('userRole');
  
  // 로그인 페이지로 리다이렉트
  router.push('/admin/login');
}

