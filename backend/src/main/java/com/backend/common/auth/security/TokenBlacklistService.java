package com.backend.common.auth.security;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {
	private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

	public void blacklistToken(String token) {
		blacklistedTokens.add(token);
	}

	public boolean isBlacklisted(String token) {
		return blacklistedTokens.contains(token);
	}

	public void removeExpiredTokens() {
		// 간단한 구현: 토큰이 만료되면 자동으로 무효화되므로
		// 실제로는 만료 시간을 추적하여 정기적으로 정리하는 것이 좋습니다
		// 현재는 메모리 기반이므로 서버 재시작 시 자동으로 초기화됩니다
	}
}

