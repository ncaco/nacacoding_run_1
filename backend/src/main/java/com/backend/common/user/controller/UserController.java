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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "02_관리자", description = "관리자(USER) 관리 API")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@Operation(summary = "관리자 목록 조회", description = "전체 관리자(USER) 목록을 조회합니다. USER 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<User>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(userService.listUsers()));
	}

	@Operation(summary = "관리자 생성", description = "새로운 관리자(USER)를 생성합니다. USER 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<User>> create(@RequestBody CreateUserRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(userService.createUser(
			request.getUsername(),
			request.getPassword(),
			request.getRole() != null ? request.getRole() : Role.USER,
			request.getName(),
			request.getEmail()
		)));
	}

	@Operation(summary = "관리자 수정", description = "관리자(USER) 정보를 수정합니다. USER 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "관리자를 찾을 수 없음")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<User>> update(@PathVariable String id,
	                                                @RequestBody UpdateUserRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(userService.updateUser(id, request.getName(), request.getEmail())));
	}

	@Operation(summary = "관리자 삭제", description = "관리자(USER)를 삭제합니다. USER 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "관리자를 찾을 수 없음")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
		userService.deleteUser(id);
		return ResponseEntity.ok(ApiResponse.ok(null));
	}

	// DTO 클래스
	public static class CreateUserRequest {
		@NotBlank
		private String username;
		@NotBlank
		private String password;
		private Role role;
		private String name;
		private String email;

		public String getUsername() { return username; }
		public void setUsername(String username) { this.username = username; }
		public String getPassword() { return password; }
		public void setPassword(String password) { this.password = password; }
		public Role getRole() { return role; }
		public void setRole(Role role) { this.role = role; }
		public String getName() { return name; }
		public void setName(String name) { this.name = name; }
		public String getEmail() { return email; }
		public void setEmail(String email) { this.email = email; }
	}

	public static class UpdateUserRequest {
		private String name;
		private String email;

		public String getName() { return name; }
		public void setName(String name) { this.name = name; }
		public String getEmail() { return email; }
		public void setEmail(String email) { this.email = email; }
	}
}


