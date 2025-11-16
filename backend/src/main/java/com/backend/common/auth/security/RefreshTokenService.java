package com.backend.common.auth.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Refresh Token 저장 및 검증 서비스
 * 메모리 기반 저장 (프로덕션에서는 DB 사용 권장)
 */
@Service
public class RefreshTokenService {
	// username -> refreshToken 저장
	private final Map<String, String> refreshTokens = new ConcurrentHashMap<>();

	/**
	 * Refresh Token 저장
	 * @param username 사용자명
	 * @param refreshToken Refresh Token
	 */
	public void saveRefreshToken(String username, String refreshToken) {
		refreshTokens.put(username, refreshToken);
	}

	/**
	 * Refresh Token 검증
	 * @param username 사용자명
	 * @param refreshToken Refresh Token
	 * @return 유효하면 true
	 */
	public boolean validateRefreshToken(String username, String refreshToken) {
		String storedToken = refreshTokens.get(username);
		return storedToken != null && storedToken.equals(refreshToken);
	}

	/**
	 * Refresh Token 삭제 (로그아웃 시)
	 * @param username 사용자명
	 */
	public void removeRefreshToken(String username) {
		refreshTokens.remove(username);
	}

	/**
	 * 만료된 Refresh Token 정리 (선택적)
	 */
	public void cleanupExpiredTokens() {
		// 메모리 기반이므로 서버 재시작 시 자동으로 초기화됨
		// 실제로는 만료 시간을 추적하여 정기적으로 정리하는 것이 좋습니다
	}
}

