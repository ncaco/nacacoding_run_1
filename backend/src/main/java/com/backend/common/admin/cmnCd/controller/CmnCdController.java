package com.backend.common.admin.cmnCd.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.admin.cmnCd.dto.CmnCdCreateRequest;
import com.backend.common.admin.cmnCd.dto.CmnCdUpdateRequest;
import com.backend.common.admin.cmnCd.model.CmnCd;
import com.backend.common.admin.cmnCd.service.CmnCdService;
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
@RequestMapping("/api/v1/cmn-cd")
@Tag(name = "09_공통코드", description = "공통코드 CRUD 관리 API")
public class CmnCdController {
	private final CmnCdService cmnCdService;

	public CmnCdController(CmnCdService cmnCdService) {
		this.cmnCdService = cmnCdService;
	}

	@Operation(summary = "공통코드 목록 조회 (트리 형태)", description = "트리 형태로 공통코드 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족 (USER 권한 필요)")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<CmnCd>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(cmnCdService.listCmnCds()));
	}

	@Operation(summary = "공통코드 목록 조회 (평면 형태)", description = "평면 형태로 공통코드 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/flat")
	public ResponseEntity<ApiResponse<List<CmnCd>>> listFlat() {
		return ResponseEntity.ok(ApiResponse.ok(cmnCdService.listCmnCdsFlat()));
	}

	@Operation(summary = "공통코드 조회", description = "ID로 공통코드 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "공통코드를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<CmnCd>> getById(@PathVariable("id") String id) {
		return cmnCdService.findById(id)
				.map(cmnCd -> ResponseEntity.ok(ApiResponse.ok(cmnCd)))
				.orElseThrow(() -> new IllegalArgumentException("공통코드를 찾을 수 없습니다: " + id));
	}

	@Operation(summary = "공통코드 조회 (코드로)", description = "코드로 공통코드 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "공통코드를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/code/{cd}")
	public ResponseEntity<ApiResponse<CmnCd>> getByCd(@PathVariable("cd") String cd) {
		return cmnCdService.findByCd(cd)
				.map(cmnCd -> ResponseEntity.ok(ApiResponse.ok(cmnCd)))
				.orElseThrow(() -> new IllegalArgumentException("공통코드를 찾을 수 없습니다: " + cd));
	}

	@Operation(summary = "공통코드 생성", description = "새로운 공통코드를 생성합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 이미 존재하는 코드"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<CmnCd>> create(@Valid @RequestBody CmnCdCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(cmnCdService.createCmnCd(request)));
	}

	@Operation(summary = "공통코드 수정", description = "공통코드 정보를 수정합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 공통코드를 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<CmnCd>> update(@PathVariable("id") String id, 
	                                                @Valid @RequestBody CmnCdUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(cmnCdService.updateCmnCd(id, request)));
	}

	@Operation(summary = "공통코드 삭제", description = "공통코드를 삭제합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "공통코드를 찾을 수 없음 또는 하위 코드 존재"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id) {
		cmnCdService.deleteCmnCd(id);
		return ResponseEntity.ok(ApiResponse.ok());
	}
}

