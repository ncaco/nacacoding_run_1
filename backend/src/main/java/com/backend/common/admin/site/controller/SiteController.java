package com.backend.common.admin.site.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.admin.site.dto.SiteCreateRequest;
import com.backend.common.admin.site.dto.SiteUpdateRequest;
import com.backend.common.admin.site.model.Site;
import com.backend.common.admin.site.model.SiteType;
import com.backend.common.admin.site.service.SiteService;
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
@RequestMapping("/api/v1/site")
@Tag(name = "06_사이트", description = "사이트 CRUD 관리 API")
public class SiteController {
	private final SiteService siteService;

	public SiteController(SiteService siteService) {
		this.siteService = siteService;
	}

	@Operation(summary = "사이트 목록 조회", description = "전체 사이트 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족 (USER 권한 필요)")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<Site>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(siteService.listSites()));
	}

	@Operation(summary = "사이트 조회", description = "ID로 사이트 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "사이트를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<Site>> getById(@PathVariable("id") String id) {
		return siteService.findById(id)
				.map(site -> ResponseEntity.ok(ApiResponse.ok(site)))
				.orElseThrow(() -> new IllegalArgumentException("사이트를 찾을 수 없습니다: " + id));
	}

	@Operation(summary = "사이트 타입으로 조회", description = "사이트 타입(ADMIN/PORTAL)으로 사이트 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "사이트를 찾을 수 없음 또는 잘못된 사이트 타입"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/type/{siteType}")
	public ResponseEntity<ApiResponse<Site>> getBySiteType(@PathVariable("siteType") String siteTypeStr) {
		SiteType siteType;
		try {
			siteType = SiteType.valueOf(siteTypeStr.toUpperCase());
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("잘못된 사이트 타입입니다. ADMIN 또는 PORTAL을 사용해주세요.");
		}
		
		return siteService.findBySiteType(siteType)
				.map(site -> ResponseEntity.ok(ApiResponse.ok(site)))
				.orElseThrow(() -> new IllegalArgumentException("사이트를 찾을 수 없습니다: " + siteType));
	}

	@Operation(summary = "사이트 생성", description = "새로운 사이트를 생성합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 이미 존재하는 사이트 타입"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<Site>> create(@Valid @RequestBody SiteCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(siteService.createSite(request)));
	}

	@Operation(summary = "사이트 수정", description = "사이트 정보를 수정합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 사이트를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<Site>> update(@PathVariable("id") String id, 
	                                                @Valid @RequestBody SiteUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(siteService.updateSite(id, request)));
	}

	@Operation(summary = "사이트 삭제", description = "사이트를 삭제합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "사이트를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id) {
		siteService.deleteSite(id);
		return ResponseEntity.ok(ApiResponse.ok());
	}
}

