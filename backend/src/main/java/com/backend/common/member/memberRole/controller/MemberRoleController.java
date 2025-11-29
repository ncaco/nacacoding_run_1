package com.backend.common.member.memberRole.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.member.memberRole.dto.MemberRoleCreateRequest;
import com.backend.common.member.memberRole.dto.MemberRoleUpdateRequest;
import com.backend.common.member.memberRole.model.MemberRole;
import com.backend.common.member.memberRole.service.MemberRoleService;
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
@RequestMapping("/api/v1/member-roles")
@Tag(name = "12_사용자역할", description = "사용자 역할(MEMBER_ROLE) 관리 API")
public class MemberRoleController {
	private final MemberRoleService memberRoleService;

	public MemberRoleController(MemberRoleService memberRoleService) {
		this.memberRoleService = memberRoleService;
	}

	@Operation(summary = "역할 목록 조회", description = "전체 역할 목록을 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<MemberRole>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(memberRoleService.listMemberRoles()));
	}

	@Operation(summary = "활성화된 역할 목록 조회", description = "활성화된 역할 목록만 조회합니다. 인증이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping("/enabled")
	public ResponseEntity<ApiResponse<List<MemberRole>>> listEnabled() {
		return ResponseEntity.ok(ApiResponse.ok(memberRoleService.listEnabledMemberRoles()));
	}

	@Operation(summary = "역할 조회", description = "ID로 역할 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "역할을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<MemberRole>> getById(@PathVariable("id") String id) {
		return memberRoleService.findById(id)
				.map(role -> ResponseEntity.ok(ApiResponse.ok(role)))
				.orElseThrow(() -> new IllegalArgumentException("역할을 찾을 수 없습니다: " + id));
	}

	@Operation(summary = "역할 조회 (코드로)", description = "역할 코드로 역할 정보를 조회합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "역할을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping("/code/{roleCd}")
	public ResponseEntity<ApiResponse<MemberRole>> getByRoleCd(@PathVariable("roleCd") String roleCd) {
		return memberRoleService.findByRoleCd(roleCd)
				.map(role -> ResponseEntity.ok(ApiResponse.ok(role)))
				.orElseThrow(() -> new IllegalArgumentException("역할을 찾을 수 없습니다: " + roleCd));
	}

	@Operation(summary = "역할 생성", description = "새로운 역할을 생성합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 이미 존재하는 역할 코드"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<MemberRole>> create(@Valid @RequestBody MemberRoleCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(memberRoleService.createMemberRole(request)));
	}

	@Operation(summary = "역할 수정", description = "역할 정보를 수정합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 역할을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<MemberRole>> update(@PathVariable("id") String id,
	                                                   @Valid @RequestBody MemberRoleUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(memberRoleService.updateMemberRole(id, request)));
	}

	@Operation(summary = "역할 삭제", description = "역할을 삭제합니다. 관리자(USER) 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "역할을 찾을 수 없음"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") String id) {
		memberRoleService.deleteMemberRole(id);
		return ResponseEntity.ok(ApiResponse.ok());
	}
}

