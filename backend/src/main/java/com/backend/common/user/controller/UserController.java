package com.backend.common.user.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.user.dto.UserCreateRequest;
import com.backend.common.user.dto.UserUpdateRequest;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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

	@Operation(
		summary = "관리자 목록 조회", 
		description = """
			전체 관리자(USER) 목록을 조회합니다.
			
			**권한:** USER 권한 필요
			**응답:** 관리자 목록 (비밀번호 제외)
			""",
		tags = {"02_관리자"}
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", 
			description = "조회 성공",
			content = @io.swagger.v3.oas.annotations.media.Content(
				mediaType = "application/json",
				examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
					value = """
						{
						  "success": true,
						  "message": "OK",
						  "data": [
						    {
						      "id": "user-id-1",
						      "username": "admin",
						      "role": "USER",
						      "name": "관리자",
						      "email": "admin@example.com",
						      "avatarUrl": null,
						      "userRoleId": "role-id-123"
						    }
						  ]
						}
						"""
				)
			)
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<User>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(userService.listUsers()));
	}

	@Operation(
		summary = "관리자 생성", 
		description = """
			새로운 관리자(USER)를 생성합니다.
			
			**권한:** USER 권한 필요
			**주의:** 사용자명은 중복될 수 없습니다.
			""",
		tags = {"02_관리자"}
	)
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
		description = "관리자 생성 정보",
		required = true,
		content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(
				value = """
					{
					  "username": "newadmin",
					  "password": "password123",
					  "role": "USER",
					  "name": "홍길동",
					  "email": "admin@example.com",
					  "userRoleId": "role-id-123"
					}
					"""
			)
		)
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", 
			description = "생성 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					value = """
						{
						  "success": true,
						  "message": "OK",
						  "data": {
						    "id": "user-id-123",
						    "username": "newadmin",
						    "role": "USER",
						    "name": "홍길동",
						    "email": "admin@example.com",
						    "avatarUrl": null,
						    "userRoleId": "role-id-123"
						  }
						}
						"""
				)
			)
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", 
			description = "잘못된 요청 (예: 중복된 사용자명)",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					value = """
						{
						  "success": false,
						  "message": "이미 존재하는 사용자명입니다: newadmin",
						  "data": null
						}
						"""
				)
			)
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<User>> create(@Valid @org.springframework.web.bind.annotation.RequestBody UserCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(userService.createUser(
			request.getUsername(),
			request.getPassword(),
			request.getRole() != null ? request.getRole() : Role.USER,
			request.getName(),
			request.getEmail(),
			request.getUserRoleId()
		)));
	}

	@Operation(
		summary = "관리자 수정", 
		description = """
			관리자(USER) 정보를 수정합니다.
			
			**권한:** USER 권한 필요
			**수정 가능 항목:** 이름, 이메일, 사용자 역할 ID
			**주의:** 비밀번호는 별도 API를 사용해야 합니다.
			""",
		tags = {"02_관리자"}
	)
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
		description = "수정할 관리자 정보",
		required = true,
		content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(
				value = """
					{
					  "name": "홍길동",
					  "email": "admin@example.com",
					  "userRoleId": "role-id-123"
					}
					"""
			)
		)
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "404", 
			description = "관리자를 찾을 수 없음",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					value = """
						{
						  "success": false,
						  "message": "관리자를 찾을 수 없습니다: user-id-123",
						  "data": null
						}
						"""
				)
			)
		)
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<User>> update(
		@Schema(description = "관리자 ID", example = "user-id-123", required = true) @PathVariable String id,
		@Valid @org.springframework.web.bind.annotation.RequestBody UserUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(userService.updateUser(id, request.getName(), request.getEmail(), request.getUserRoleId())));
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
}


