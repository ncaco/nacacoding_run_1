package com.backend.common.auth.controller;

import com.backend.common.auth.dto.LoginRequest;
import com.backend.common.auth.dto.LoginResponse;
import com.backend.common.auth.security.JwtUtil;
import com.backend.common.auth.security.TokenBlacklistService;
import com.backend.core.dto.ApiResponse;
import com.backend.common.user.model.User;
import com.backend.common.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
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

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
		User user = userService.findByUsername(req.getUsername())
				.filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()))
				.orElseThrow(() -> new IllegalArgumentException("invalid credentials"));
		String token = jwtUtil.generateToken(user.getUsername(), Map.of("role", user.getRole().name()));
		return ResponseEntity.ok(ApiResponse.ok(new LoginResponse(token)));
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
	                                                 Authentication authentication) {
		if (authorization != null && authorization.startsWith("Bearer ")) {
			String token = authorization.substring(7);
			tokenBlacklistService.blacklistToken(token);
		}
		return ResponseEntity.ok(ApiResponse.ok());
	}
}


