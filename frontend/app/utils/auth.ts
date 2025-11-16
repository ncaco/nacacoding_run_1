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

// Refresh Token으로 Access Token 갱신
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('adminRefreshToken');
    if (!refreshToken) {
      return null;
    }

    const response = await fetch('http://localhost:8080/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return null;
    }

    // 새로운 토큰 저장
    if (data.data?.token) {
      localStorage.setItem('adminToken', data.data.token);
      if (data.data?.refreshToken) {
        localStorage.setItem('adminRefreshToken', data.data.refreshToken);
      }
      return data.data.token;
    }

    return null;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    return null;
  }
}

// API 호출 시 토큰 자동 갱신 (401 오류 발생 시)
export async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('adminToken');
  
  // Authorization 헤더 추가 (FormData인 경우 Content-Type을 설정하지 않음)
  const headers = new Headers();
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers.set(key, value);
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers.set(key, value);
      });
    } else {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, value.toString());
        }
      });
    }
  }
  
  // FormData가 아닌 경우에만 Authorization 헤더 추가
  if (token && !(options.body instanceof FormData)) {
    headers.set('Authorization', `Bearer ${token}`);
  } else if (token) {
    // FormData인 경우에도 Authorization 헤더는 추가 가능
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    headers: headers,
  });

  // 401 오류 발생 시 Refresh Token으로 갱신 시도
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // 새로운 토큰으로 재시도
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(url, {
        ...options,
        headers: headers,
      });
    }
  }

  return response;
}

// 로그아웃 처리
export function logout(router: any) {
  // 로컬 스토리지에서 토큰 및 사용자 정보 제거
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRefreshToken');
  localStorage.removeItem('adminUsername');
  localStorage.removeItem('userRole');
  
  // 로그인 페이지로 리다이렉트
  router.push('/admin/login');
}

