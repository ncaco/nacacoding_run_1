/**
 * API 기본 URL을 반환합니다.
 * 환경 변수 NEXT_PUBLIC_API_BASE_URL이 설정되어 있으면 사용하고,
 * 없으면 기본값(http://localhost:8080/api/v1)을 사용합니다.
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
}

/**
 * API 엔드포인트 URL을 생성합니다.
 * @param endpoint - API 엔드포인트 경로 (예: '/site', '/menu')
 * @returns 전체 API URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  // endpoint가 이미 '/'로 시작하면 그대로 사용, 아니면 '/' 추가
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
}

