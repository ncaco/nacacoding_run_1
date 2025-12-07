package com.backend.common.member.controller;

import com.backend.core.dto.ApiResponse;
import com.backend.common.member.dto.MemberCreateRequest;
import com.backend.common.member.dto.MemberUpdateRequest;
import com.backend.common.member.dto.MemberProfileUpdateRequest;
import com.backend.common.member.dto.MemberPasswordChangeRequest;
import com.backend.common.member.model.Member;
import com.backend.common.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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

	@Operation(summary = "현재 사용자 프로필 수정", description = "로그인한 사용자(MEMBER)의 프로필 정보를 수정합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PutMapping("/me")
	public ResponseEntity<ApiResponse<Member>> updateMe(Authentication auth,
	                                                   @Valid @RequestBody MemberProfileUpdateRequest request) {
		String username = auth.getName();

		Member updated = memberService.updateMyProfile(
			username,
			request.getName(),
			request.getEmail(),
			request.getPhoneNumber()
		);

		return ResponseEntity.ok(ApiResponse.ok(updated));
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
	public ResponseEntity<ApiResponse<Member>> create(@Valid @RequestBody MemberCreateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(
			memberService.createMember(
				request.getUsername(),
				request.getPassword(),
				request.getName(),
				request.getEmail(),
				request.getPhoneNumber(),
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
	                                                   @Valid @RequestBody MemberUpdateRequest request) {
		return ResponseEntity.ok(ApiResponse.ok(
			memberService.updateMember(
				id,
				request.getName(),
				request.getEmail(),
				request.getPhoneNumber()
			)
		));
	}

	@Operation(summary = "현재 사용자 비밀번호 변경", description = "로그인한 사용자(MEMBER)의 비밀번호를 변경합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "변경 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 현재 비밀번호 불일치"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PostMapping("/me/password")
	public ResponseEntity<ApiResponse<Void>> changePassword(Authentication auth,
	                                                       @Valid @RequestBody MemberPasswordChangeRequest request) {
		String username = auth.getName();

		if (!request.getNewPassword().equals(request.getConfirmPassword())) {
			throw new IllegalArgumentException("신규 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
		}

		memberService.changePassword(username, request.getCurrentPassword(), request.getNewPassword());

		return ResponseEntity.ok(ApiResponse.ok(null));
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
}

