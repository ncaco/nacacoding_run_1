package com.backend.common.auth.controller;

import com.backend.common.auth.dto.LoginRequest;
import com.backend.common.auth.dto.LoginResponse;
import com.backend.common.auth.dto.PasswordChangeRequest;
import com.backend.common.auth.dto.ProfileUpdateRequest;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

	@Operation(summary = "프로필 조회", description = "현재 로그인한 관리자의 프로필 정보를 조회합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping("/profile/admin")
	public ResponseEntity<ApiResponse<User>> getAdminProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		try {
			// 토큰에서 역할 확인
			String role = jwtUtil.getRole(token);
			if (!Role.USER.name().equals(role)) {
				throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
			}
			
			// 토큰에서 사용자명 추출
			String username = jwtUtil.getUsername(token);
			User user = userService.findByUsername(username)
					.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
			
			// 비밀번호는 응답에서 제외
			user.setPassword("");
			
			return ResponseEntity.ok(ApiResponse.ok(user));
		} catch (Exception e) {
			// JWT 토큰 검증 실패 또는 만료
			if (e instanceof IllegalArgumentException) {
				throw e;
			}
			throw new IllegalArgumentException("유효하지 않은 토큰입니다. 다시 로그인해주세요.");
		}
	}

	@Operation(summary = "프로필 수정", description = "현재 로그인한 관리자의 프로필 정보(이름, 이메일)를 수정합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PutMapping("/profile/admin")
	public ResponseEntity<ApiResponse<User>> updateAdminProfile(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
			@Valid @RequestBody ProfileUpdateRequest request) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		// 토큰에서 역할 확인
		String role = jwtUtil.getRole(token);
		if (!Role.USER.name().equals(role)) {
			throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
		}
		
		// 토큰에서 사용자명 추출
		String username = jwtUtil.getUsername(token);
		User user = userService.updateProfile(username, request.getName(), request.getEmail(), request.getAvatarUrl());
		
		// 비밀번호는 응답에서 제외
		user.setPassword("");
		
		return ResponseEntity.ok(ApiResponse.ok(user));
	}

	@Operation(summary = "비밀번호 변경", description = "현재 로그인한 관리자의 비밀번호를 변경합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "변경 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 현재 비밀번호 불일치"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PutMapping("/password/admin")
	public ResponseEntity<ApiResponse<Void>> changeAdminPassword(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
			@Valid @RequestBody PasswordChangeRequest request) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		// 토큰에서 역할 확인
		String role = jwtUtil.getRole(token);
		if (!Role.USER.name().equals(role)) {
			throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
		}
		
		// 토큰에서 사용자명 추출
		String username = jwtUtil.getUsername(token);
		userService.changePassword(username, request.getCurrentPassword(), request.getNewPassword());
		
		return ResponseEntity.ok(ApiResponse.ok());
	}
}


