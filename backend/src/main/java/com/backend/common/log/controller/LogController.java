package com.backend.common.log.controller;

import com.backend.core.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/v1/logs")
@Tag(name = "로그", description = "로그 관리 API")
public class LogController {
	private final List<Map<String, Object>> logs = new CopyOnWriteArrayList<>();

	@Operation(summary = "로그 목록 조회", description = "저장된 모든 로그 목록을 조회합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping
	public ResponseEntity<ApiResponse<List<Map<String, Object>>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(new ArrayList<>(logs)));
	}

	@Operation(summary = "로그 추가", description = "새로운 로그를 추가합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "추가 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PostMapping
	public ResponseEntity<ApiResponse<Void>> append(@RequestBody Map<String, Object> payload) {
		logs.add(Map.of("timestamp", Instant.now().toString(), "payload", payload));
		return ResponseEntity.ok(ApiResponse.ok());
	}
}


