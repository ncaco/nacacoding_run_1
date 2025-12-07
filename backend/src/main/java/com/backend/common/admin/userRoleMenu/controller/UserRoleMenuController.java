package com.backend.common.admin.userRoleMenu.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.admin.userRoleMenu.dto.MenuPermissionResponse;
import com.backend.common.admin.userRoleMenu.dto.UserRoleMenuRequest;
import com.backend.common.admin.userRoleMenu.service.UserRoleMenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user-role-menu")
@Tag(name = "12_사용자역할메뉴", description = "사용자 역할별 메뉴 권한 관리 API")
public class UserRoleMenuController {
	private final UserRoleMenuService userRoleMenuService;

	public UserRoleMenuController(UserRoleMenuService userRoleMenuService) {
		this.userRoleMenuService = userRoleMenuService;
	}

	@Operation(summary = "역할별 메뉴 권한 조회", description = "특정 역할의 메뉴 권한 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "역할을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/role/{userRoleId}")
	public ResponseEntity<ApiResponse<MenuPermissionResponse>> getMenuPermissions(@PathVariable("userRoleId") String userRoleId) {
		return ResponseEntity.ok(ApiResponse.ok(userRoleMenuService.getMenuPermissions(userRoleId)));
	}

	@Operation(summary = "역할별 메뉴 권한 저장", description = "특정 역할의 메뉴 권한을 저장합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "저장 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 역할/메뉴를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<Void>> saveMenuPermissions(@Valid @RequestBody UserRoleMenuRequest request) {
		userRoleMenuService.saveMenuPermissions(request);
		return ResponseEntity.ok(ApiResponse.ok());
	}
}

