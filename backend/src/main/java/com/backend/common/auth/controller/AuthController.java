package com.backend.common.auth.controller;

import com.backend.common.auth.dto.LoginRequest;
import com.backend.common.auth.dto.LoginResponse;
import com.backend.common.auth.security.JwtUtil;
import com.backend.common.auth.security.TokenBlacklistService;
import com.backend.core.dto.ApiResponse;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "인증", description = "로그인/로그아웃 API")
public class AuthController {
	private final UserService userService;
	private final JwtUtil jwtUtil;
	private final TokenBlacklistService tokenBlacklistService;
	private final PasswordEncoder passwordEncoder;

	public AuthController(UserService userService, JwtUtil jwtUtil, TokenBlacklistService tokenBlacklistService, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.jwtUtil = jwtUtil;
		this.tokenBlacklistService = tokenBlacklistService;
		this.passwordEncoder = passwordEncoder;
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
		String token = jwtUtil.generateToken(user.getUsername(), Map.of("role", user.getRole().name()));
		return ResponseEntity.ok(ApiResponse.ok(new LoginResponse(token)));
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
		String token = jwtUtil.generateToken(user.getUsername(), Map.of("role", user.getRole().name()));
		return ResponseEntity.ok(ApiResponse.ok(new LoginResponse(token)));
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
		return ResponseEntity.ok(ApiResponse.ok());
	}
}


