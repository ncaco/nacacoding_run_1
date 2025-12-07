package com.backend.common.admin.site.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.admin.site.dto.SiteCreateRequest;
import com.backend.common.admin.site.dto.SiteUpdateRequest;
import com.backend.common.admin.site.model.Site;
import com.backend.common.admin.site.service.SiteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
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

	@Operation(
		summary = "사이트 목록 조회", 
		description = """
			전체 사이트 목록을 조회합니다.
			
			**인증:** 선택사항 (인증 없이도 조회 가능)
			**응답:** 모든 사이트 목록
			""",
		tags = {"06_사이트"}
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
						      "id": "site-id-1",
						      "siteType": "C001",
						      "siteName": "통합관리시스템",
						      "description": "통합 관리 시스템",
						      "contextPath": "admin",
						      "version": "1.0.0",
						      "enabled": true
						    }
						  ]
						}
						"""
				)
			)
		)
	})
	@GetMapping
	public ResponseEntity<ApiResponse<List<Site>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(siteService.listSites()));
	}

	@Operation(
		summary = "사이트 조회", 
		description = "ID로 사이트 정보를 조회합니다.",
		tags = {"06_사이트"}
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", 
			description = "사이트를 찾을 수 없음",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					value = """
						{
						  "success": false,
						  "message": "사이트를 찾을 수 없습니다: site-id-123",
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
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<Site>> getById(
		@Schema(description = "사이트 ID", example = "site-id-123", required = true) @PathVariable("id") String id) {
		return siteService.findById(id)
				.map(site -> ResponseEntity.ok(ApiResponse.ok(site)))
				.orElseThrow(() -> new IllegalArgumentException("사이트를 찾을 수 없습니다: " + id));
	}

	@Operation(summary = "사이트 타입으로 조회", description = "사이트 타입(공통코드 P001의 하위코드)으로 사이트 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "사이트를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/type/{siteType}")
	public ResponseEntity<ApiResponse<Site>> getBySiteType(@PathVariable("siteType") String siteType) {
		return siteService.findBySiteType(siteType)
				.map(site -> ResponseEntity.ok(ApiResponse.ok(site)))
				.orElseThrow(() -> new IllegalArgumentException("사이트를 찾을 수 없습니다: " + siteType));
	}

	@Operation(summary = "Context Path로 사이트 조회", description = "Context Path로 사이트 정보를 조회합니다. 인증은 선택사항입니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "사이트를 찾을 수 없음")
	})
	@GetMapping("/context-path/{contextPath}")
	public ResponseEntity<ApiResponse<Site>> getByContextPath(@PathVariable("contextPath") String contextPath) {
		// 빈 문자열인 경우 URL 인코딩된 값으로 처리
		String decodedContextPath = contextPath.equals("root") ? "" : contextPath;
		return siteService.findByContextPath(decodedContextPath)
				.map(site -> ResponseEntity.ok(ApiResponse.ok(site)))
				.orElseThrow(() -> new IllegalArgumentException("사이트를 찾을 수 없습니다: " + contextPath));
	}

	@Operation(
		summary = "사이트 생성", 
		description = """
			새로운 사이트를 생성합니다.
			
			**권한:** USER 권한 필요
			**주의:** Context Path는 중복될 수 없습니다.
			""",
		tags = {"06_사이트"}
	)
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
		description = "사이트 생성 정보",
		required = true,
		content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(
				value = """
					{
					  "siteType": "C001",
					  "siteName": "통합관리시스템",
					  "description": "통합 관리 시스템",
					  "contextPath": "admin",
					  "version": "1.0.0"
					}
					"""
			)
		)
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", 
			description = "잘못된 요청 또는 이미 존재하는 Context Path",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(
					value = """
						{
						  "success": false,
						  "message": "이미 존재하는 Context Path입니다: admin",
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
	public ResponseEntity<ApiResponse<Site>> create(@Valid @org.springframework.web.bind.annotation.RequestBody SiteCreateRequest request) {
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

