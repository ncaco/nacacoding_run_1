package com.backend.common.admin.controller;

import com.backend.core.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "관리자", description = "관리자 전용 API (ADMIN 권한 필요)")
public class AdminController {

	@Operation(summary = "관리자 대시보드", description = "관리자 대시보드 정보를 조회합니다. ADMIN 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족 (ADMIN 권한 필요)")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/dashboard")
	public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
		return ResponseEntity.ok(ApiResponse.ok(Map.of("status", "admin ok")));
	}
}


