package com.backend.common.auth.controller;

import com.backend.common.auth.dto.LoginRequest;
import com.backend.common.auth.dto.LoginResponse;
import com.backend.common.auth.dto.RefreshTokenRequest;
import com.backend.common.auth.security.JwtUtil;
import com.backend.common.auth.security.RefreshTokenService;
import com.backend.common.auth.security.TokenBlacklistService;
import com.backend.core.dto.ApiResponse;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.service.UserService;
import com.backend.common.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
@Tag(name = "01_인증", description = "로그인/로그아웃 API")
public class AuthController {
	private final UserService userService;
	private final JwtUtil jwtUtil;
	private final TokenBlacklistService tokenBlacklistService;
	private final RefreshTokenService refreshTokenService;
	private final PasswordEncoder passwordEncoder;
	private final MemberService memberService;
	private static final long REFRESH_TOKEN_VALIDITY_SECONDS = 86400 * 7; // 7일

	public AuthController(UserService userService, JwtUtil jwtUtil, TokenBlacklistService tokenBlacklistService,
	                      RefreshTokenService refreshTokenService, PasswordEncoder passwordEncoder,
	                      MemberService memberService) {
		this.userService = userService;
		this.jwtUtil = jwtUtil;
		this.tokenBlacklistService = tokenBlacklistService;
		this.refreshTokenService = refreshTokenService;
		this.passwordEncoder = passwordEncoder;
		this.memberService = memberService;
	}

	@Operation(summary = "사용자 로그인", description = "사용자(MEMBER) 계정으로 로그인하여 JWT 토큰을 발급받습니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그인 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 인증 정보 또는 권한 부족")
	})
	@PostMapping("/login/user")
	public ResponseEntity<ApiResponse<LoginResponse>> loginUser(@Valid @RequestBody LoginRequest req) {
		User user = userService.findByUsername(req.getUsername())
				.filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()))
				.filter(u -> u.getRole() == Role.MEMBER)
				.orElseThrow(() -> new IllegalArgumentException("invalid credentials or insufficient privileges"));

		// MEMBERS 테이블 기준 마지막 로그인 일시 업데이트
		memberService.updateLastLogin(user.getUsername());

		// Access Token 생성
		String accessToken = jwtUtil.generateToken(user.getUsername(), Map.of("role", user.getRole().name()));
		
		// Refresh Token 생성
		String refreshToken = jwtUtil.generateRefreshToken(user.getUsername(), REFRESH_TOKEN_VALIDITY_SECONDS);
		
		// Refresh Token 저장
		refreshTokenService.saveRefreshToken(user.getUsername(), refreshToken);
		
		return ResponseEntity.ok(ApiResponse.ok(new LoginResponse(accessToken, refreshToken)));
	}

	@Operation(summary = "관리자 로그인", description = "관리자(USER) 계정으로 로그인하여 JWT 토큰을 발급받습니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그인 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 인증 정보 또는 권한 부족")
	})
	@PostMapping("/login/admin")
	public ResponseEntity<ApiResponse<LoginResponse>> loginAdmin(@Valid @RequestBody LoginRequest req) {
		User user = userService.findByUsername(req.getUsername())
				.filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()))
				.filter(u -> u.getRole() == Role.USER)
				.orElseThrow(() -> new IllegalArgumentException("invalid credentials or insufficient privileges"));
		
		// Access Token 생성
		String accessToken = jwtUtil.generateToken(user.getUsername(), Map.of("role", user.getRole().name()));
		
		// Refresh Token 생성
		String refreshToken = jwtUtil.generateRefreshToken(user.getUsername(), REFRESH_TOKEN_VALIDITY_SECONDS);
		
		// Refresh Token 저장
		refreshTokenService.saveRefreshToken(user.getUsername(), refreshToken);
		
		return ResponseEntity.ok(ApiResponse.ok(new LoginResponse(accessToken, refreshToken)));
	}

	@Operation(summary = "사용자 로그아웃", description = "사용자(MEMBER) 계정의 JWT 토큰을 무효화합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그아웃 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 권한 부족"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PostMapping("/logout/user")
	public ResponseEntity<ApiResponse<Void>> logoutUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		// 토큰에서 역할 확인
		String role = jwtUtil.getRole(token);
		if (!Role.MEMBER.name().equals(role)) {
			throw new IllegalArgumentException("사용자(MEMBER) 권한이 필요합니다.");
		}
		
		tokenBlacklistService.blacklistToken(token);
		
		// Refresh Token도 삭제
		String username = jwtUtil.getUsername(token);
		refreshTokenService.removeRefreshToken(username);
		
		return ResponseEntity.ok(ApiResponse.ok());
	}

	@Operation(summary = "관리자 로그아웃", description = "관리자(USER) 계정의 JWT 토큰을 무효화합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그아웃 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 권한 부족"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PostMapping("/logout/admin")
	public ResponseEntity<ApiResponse<Void>> logoutAdmin(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		// 토큰에서 역할 확인
		String role = jwtUtil.getRole(token);
		if (!Role.USER.name().equals(role)) {
			throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
		}
		
		tokenBlacklistService.blacklistToken(token);
		
		// Refresh Token도 삭제
		String username = jwtUtil.getUsername(token);
		refreshTokenService.removeRefreshToken(username);
		
		return ResponseEntity.ok(ApiResponse.ok());
	}

	@Operation(summary = "토큰 갱신", description = "Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "갱신 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 Refresh Token"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
		String refreshToken = request.getRefreshToken();
		
		if (refreshToken == null || refreshToken.isEmpty()) {
			throw new IllegalArgumentException("Refresh Token이 필요합니다.");
		}
		
		try {
			// Refresh Token 검증
			if (!jwtUtil.isRefreshToken(refreshToken)) {
				throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
			}
			
			// 토큰에서 사용자명 추출
			String username = jwtUtil.getUsername(refreshToken);
			
			// 저장된 Refresh Token과 일치하는지 확인
			if (!refreshTokenService.validateRefreshToken(username, refreshToken)) {
				throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
			}
			
			// 사용자 정보 조회
			User user = userService.findByUsername(username)
					.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
			
			// 새로운 Access Token 생성
			String newAccessToken = jwtUtil.generateToken(user.getUsername(), Map.of("role", user.getRole().name()));
			
			// 새로운 Refresh Token 생성 (선택적 - Refresh Token Rotation)
			String newRefreshToken = jwtUtil.generateRefreshToken(user.getUsername(), REFRESH_TOKEN_VALIDITY_SECONDS);
			
			// 기존 Refresh Token 삭제하고 새로운 Refresh Token 저장
			refreshTokenService.removeRefreshToken(username);
			refreshTokenService.saveRefreshToken(username, newRefreshToken);
			
			return ResponseEntity.ok(ApiResponse.ok(new LoginResponse(newAccessToken, newRefreshToken)));
		} catch (Exception e) {
			if (e instanceof IllegalArgumentException) {
				throw e;
			}
			throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.");
		}
	}
}

