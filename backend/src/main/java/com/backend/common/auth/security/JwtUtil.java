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
}


