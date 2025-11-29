package com.backend.common.admin.menu.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.admin.menu.dto.MenuCreateRequest;
import com.backend.common.admin.menu.dto.MenuUpdateRequest;
import com.backend.common.admin.menu.model.Menu;
import com.backend.common.admin.menu.service.MenuService;
import com.backend.common.auth.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menu")
@Tag(name = "07_메뉴", description = "메뉴 CRUD 관리 API")
public class MenuController {
	private final MenuService menuService;
	private final JwtUtil jwtUtil;

	public MenuController(MenuService menuService, JwtUtil jwtUtil) {
		this.menuService = menuService;
		this.jwtUtil = jwtUtil;
	}

	@Operation(summary = "메뉴 목록 조회", description = "전체 메뉴 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족 (USER 권한 필요)")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<Menu>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(menuService.listMenus()));
	}

	@Operation(summary = "사이트별 메뉴 목록 조회", description = "특정 사이트의 메뉴 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/site/{siteId}")
	public ResponseEntity<ApiResponse<List<Menu>>> listBySiteId(@PathVariable("siteId") String siteId) {
		return ResponseEntity.ok(ApiResponse.ok(menuService.listMenusBySiteId(siteId)));
	}

	@Operation(summary = "활성화된 메뉴 목록 조회", description = "특정 사이트의 활성화된 메뉴 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/site/{siteId}/enabled")
	public ResponseEntity<ApiResponse<List<Menu>>> listEnabledBySiteId(@PathVariable("siteId") String siteId) {
		return ResponseEntity.ok(ApiResponse.ok(menuService.listEnabledMenusBySiteId(siteId)));
	}

	@Operation(summary = "권한 기반 활성화된 메뉴 목록 조회", description = "현재 로그인한 사용자의 권한에 따라 특정 사이트의 활성화된 메뉴 목록을 조회합니다. 읽기 권한이 있는 메뉴만 반환됩니다. 관리자(USER)는 USER_ROLE_MENU 테이블을, 회원(MEMBER)은 MEMBER_ROLE_MENU 테이블을 사용합니다. 로그인하지 않은 경우 비회원(GUEST) 권한으로 조회합니다. 인증은 선택사항입니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청")
	})
	@GetMapping("/site/{siteId}/enabled/with-permissions")
	public ResponseEntity<ApiResponse<List<Menu>>> listEnabledBySiteIdWithPermissions(
			@PathVariable("siteId") String siteId,
			@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
		String username = null;
		// 인증 토큰이 있으면 사용자명 추출
		if (authorization != null && authorization.startsWith("Bearer ")) {
			try {
				String token = authorization.substring(7);
				username = jwtUtil.getUsername(token);
			} catch (Exception e) {
				// 토큰이 유효하지 않으면 비회원으로 처리
				username = null;
			}
		}
		// username이 null이면 비회원(GUEST) 권한으로 처리
		return ResponseEntity.ok(ApiResponse.ok(menuService.listEnabledMenusBySiteIdWithPermissions(siteId, username)));
	}

	@Operation(summary = "메뉴 조회", description = "ID로 메뉴 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "메뉴를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<Menu>> getById(@PathVariable("id") String id) {
		return menuService.findById(id)
				.map(menu -> ResponseEntity.ok(ApiResponse.ok(menu)))
				.orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + id));
	}

	@Operation(summary = "메뉴 생성", description = "새로운 메뉴를 생성합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 사이트/부모 메뉴를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<Menu>> create(@Valid @RequestBody MenuCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(menuService.createMenu(request)));
	}

	@Operation(summary = "메뉴 수정", description = "메뉴 정보를 수정합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 메뉴를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<Menu>> update(@PathVariable("id") String id, 
	                                                @Valid @RequestBody MenuUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(menuService.updateMenu(id, request)));
	}

	@Operation(summary = "메뉴 삭제", description = "메뉴를 삭제합니다. 하위 메뉴가 있으면 삭제할 수 없습니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "메뉴를 찾을 수 없음 또는 하위 메뉴 존재"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id) {
		menuService.deleteMenu(id);
		return ResponseEntity.ok(ApiResponse.ok());
	}
}

