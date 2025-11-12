package com.backend.common.user.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "사용자", description = "사용자 관리 API")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@Operation(summary = "현재 사용자 정보 조회", description = "로그인한 사용자의 정보를 조회합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping("/me")
	public ResponseEntity<ApiResponse<Map<String, Object>>> me(Authentication auth) {
		return ResponseEntity.ok(ApiResponse.ok(Map.of("username", auth.getName())));
	}

	@Operation(summary = "사용자 목록 조회", description = "전체 사용자 목록을 조회합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping
	public ResponseEntity<ApiResponse<List<User>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(userService.listUsers()));
	}

	@Operation(summary = "사용자 생성", description = "새로운 사용자를 생성합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PostMapping
	public ResponseEntity<ApiResponse<User>> create(@RequestParam @NotBlank String username,
	                                                @RequestParam @NotBlank String password,
	                                                @RequestParam(defaultValue = "USER") Role role) {
		return ResponseEntity.ok(ApiResponse.ok(userService.createUser(username, password, role)));
	}
}


