package com.backend.common.admin.icon.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.admin.icon.dto.IconCreateRequest;
import com.backend.common.admin.icon.dto.IconUpdateRequest;
import com.backend.common.admin.icon.model.Icon;
import com.backend.common.admin.icon.service.IconService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/icon")
@Tag(name = "10_아이콘", description = "아이콘 CRUD 관리 API")
public class IconController {
	private final IconService iconService;

	public IconController(IconService iconService) {
		this.iconService = iconService;
	}

	@Operation(summary = "아이콘 목록 조회", description = "모든 아이콘 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족 (USER 권한 필요)")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<Icon>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(iconService.listIcons()));
	}

	@Operation(summary = "활성화된 아이콘 목록 조회", description = "활성화된 아이콘 목록만 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/enabled")
	public ResponseEntity<ApiResponse<List<Icon>>> listEnabled() {
		return ResponseEntity.ok(ApiResponse.ok(iconService.listEnabledIcons()));
	}

	@Operation(summary = "아이콘 조회", description = "ID로 아이콘 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "아이콘을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<Icon>> getById(@PathVariable("id") String id) {
		return iconService.findById(id)
				.map(icon -> ResponseEntity.ok(ApiResponse.ok(icon)))
				.orElseThrow(() -> new IllegalArgumentException("아이콘을 찾을 수 없습니다: " + id));
	}

	@Operation(summary = "아이콘 조회 (iconId로)", description = "iconId로 아이콘 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "아이콘을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/icon-id/{iconId}")
	public ResponseEntity<ApiResponse<Icon>> getByIconId(@PathVariable("iconId") String iconId) {
		return iconService.findByIconId(iconId)
				.map(icon -> ResponseEntity.ok(ApiResponse.ok(icon)))
				.orElseThrow(() -> new IllegalArgumentException("아이콘을 찾을 수 없습니다: " + iconId));
	}

	@Operation(summary = "아이콘 생성", description = "새로운 아이콘을 생성합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 이미 존재하는 iconId"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<Icon>> create(@Valid @RequestBody IconCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(iconService.createIcon(request)));
	}

	@Operation(summary = "아이콘 수정", description = "아이콘 정보를 수정합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 아이콘을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<Icon>> update(@PathVariable("id") String id, 
	                                                @Valid @RequestBody IconUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(iconService.updateIcon(id, request)));
	}

	@Operation(summary = "아이콘 삭제", description = "아이콘을 삭제합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "아이콘을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id) {
		iconService.deleteIcon(id);
		return ResponseEntity.ok(ApiResponse.ok());
	}
}

