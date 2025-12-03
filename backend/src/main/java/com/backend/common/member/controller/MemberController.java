package com.backend.common.member.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.member.model.Member;
import com.backend.common.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/members")
@Tag(name = "03_사용자", description = "사용자(MEMBER) 관리 API")
public class MemberController {
	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	@Operation(summary = "현재 사용자 정보 조회", description = "로그인한 사용자의 정보를 MEMBERS 테이블 기준으로 조회합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
	})
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping("/me")
	public ResponseEntity<ApiResponse<Member>> me(Authentication auth) {
		String username = auth.getName();

		Member member = memberService.findByUsername(username)
				.orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다: " + username));

		return ResponseEntity.ok(ApiResponse.ok(member));
	}

	@Operation(summary = "사용자 목록 조회", description = "전체 사용자(MEMBER) 목록을 조회합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<ApiResponse<List<Member>>> list() {
		return ResponseEntity.ok(ApiResponse.ok(memberService.listMembers()));
	}

	@Operation(summary = "사용자 생성", description = "새로운 사용자(MEMBER)를 생성합니다. USER 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "생성 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PostMapping
	public ResponseEntity<ApiResponse<Member>> create(@RequestBody CreateMemberRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(
			memberService.createMember(
				request.getUsername(),
				request.getPassword(),
				request.getName(),
				request.getEmail(),
				request.getCreatedAt()
			)
		));
	}

	@Operation(summary = "사용자 수정", description = "사용자(MEMBER) 정보를 수정합니다. USER 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<Member>> update(@PathVariable String id,
	                                                   @RequestBody UpdateMemberRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(memberService.updateMember(id, request.getName(), request.getEmail())));
	}

	@Operation(summary = "사용자 삭제", description = "사용자(MEMBER)를 삭제합니다. USER 권한이 필요합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "권한 부족"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PreAuthorize("hasRole('USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
		memberService.deleteMember(id);
		return ResponseEntity.ok(ApiResponse.ok(null));
	}

	// DTO 클래스
	public static class CreateMemberRequest {
		@NotBlank
		private String username;
		@NotBlank
		private String password;
		private String name;
		private String email;
		// 가입 일시 (관리자에서 직접 지정 가능, 미지정 시 서버에서 현재 시간으로 처리)
		private java.time.LocalDateTime createdAt;

		public String getUsername() { return username; }
		public void setUsername(String username) { this.username = username; }
		public String getPassword() { return password; }
		public void setPassword(String password) { this.password = password; }
		public String getName() { return name; }
		public void setName(String name) { this.name = name; }
		public String getEmail() { return email; }
		public void setEmail(String email) { this.email = email; }
		public java.time.LocalDateTime getCreatedAt() { return createdAt; }
		public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
	}

	public static class UpdateMemberRequest {
		private String name;
		private String email;

		public String getName() { return name; }
		public void setName(String name) { this.name = name; }
		public String getEmail() { return email; }
		public void setEmail(String email) { this.email = email; }
	}
}

