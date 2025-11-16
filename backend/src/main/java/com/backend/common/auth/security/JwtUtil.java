package com.backend.common.auth.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

public class JwtUtil {
	private final SecretKey secretKey;
	private final long validitySeconds;

	public JwtUtil(String base64Secret, long validitySeconds) {
		this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
		this.validitySeconds = validitySeconds;
	}

	public String generateToken(String subject, Map<String, Object> claims) {
		Instant now = Instant.now();
		return Jwts.builder()
				.subject(subject)
				.claims(claims)
				.issuedAt(Date.from(now))
				.expiration(Date.from(now.plusSeconds(validitySeconds)))
				.signWith(secretKey)
				.compact();
	}

	public String getSubject(String token) {
		return Jwts.parser().verifyWith(secretKey).build()
				.parseSignedClaims(token)
				.getPayload().getSubject();
	}

	public String getRole(String token) {
		Object role = Jwts.parser().verifyWith(secretKey).build()
				.parseSignedClaims(token)
				.getPayload().get("role");
		return role != null ? role.toString() : "USER";
	}

	public String getUsername(String token) {
		return getSubject(token);
	}

	/**
	 * Refresh Token 생성 (더 긴 만료시간)
	 * @param subject 사용자명
	 * @param refreshValiditySeconds Refresh Token 만료시간 (초)
	 * @return Refresh Token
	 */
	public String generateRefreshToken(String subject, long refreshValiditySeconds) {
		Instant now = Instant.now();
		return Jwts.builder()
				.subject(subject)
				.claim("type", "refresh") // Refresh Token임을 표시
				.issuedAt(Date.from(now))
				.expiration(Date.from(now.plusSeconds(refreshValiditySeconds)))
				.signWith(secretKey)
				.compact();
	}

	/**
	 * 토큰이 Refresh Token인지 확인
	 * @param token JWT 토큰
	 * @return Refresh Token이면 true
	 */
	public boolean isRefreshToken(String token) {
		try {
			Object type = Jwts.parser().verifyWith(secretKey).build()
					.parseSignedClaims(token)
					.getPayload().get("type");
			return "refresh".equals(type);
		} catch (Exception e) {
			return false;
		}
	}
}


