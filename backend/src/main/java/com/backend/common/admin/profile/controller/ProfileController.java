package com.backend.common.admin.profile.controller;

import com.backend.common.auth.dto.PasswordChangeRequest;
import com.backend.common.auth.dto.ProfileUpdateRequest;
import com.backend.common.auth.security.JwtUtil;
import com.backend.core.dto.ApiResponse;
import com.backend.common.user.model.Role;
import com.backend.common.user.model.User;
import com.backend.common.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/profile")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
@Tag(name = "08_프로필", description = "관리자 프로필 관리 API")
public class ProfileController {
	private final UserService userService;
	private final JwtUtil jwtUtil;

	public ProfileController(UserService userService, JwtUtil jwtUtil) {
		this.userService = userService;
		this.jwtUtil = jwtUtil;
	}

	@Operation(summary = "프로필 조회", description = "현재 로그인한 관리자의 프로필 정보를 조회합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@GetMapping
	public ResponseEntity<ApiResponse<User>> getProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		try {
			// 토큰에서 역할 확인
			String role = jwtUtil.getRole(token);
			if (!Role.USER.name().equals(role)) {
				throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
			}
			
			// 토큰에서 사용자명 추출
			String username = jwtUtil.getUsername(token);
			User user = userService.findByUsername(username)
					.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
			
			// 비밀번호는 응답에서 제외
			user.setPassword("");
			
			return ResponseEntity.ok(ApiResponse.ok(user));
		} catch (Exception e) {
			// JWT 토큰 검증 실패 또는 만료
			if (e instanceof IllegalArgumentException) {
				throw e;
			}
			throw new IllegalArgumentException("유효하지 않은 토큰입니다. 다시 로그인해주세요.");
		}
	}

	@Operation(summary = "프로필 수정", description = "현재 로그인한 관리자의 프로필 정보(이름, 이메일)를 수정합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PutMapping
	public ResponseEntity<ApiResponse<User>> updateProfile(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
			@Valid @RequestBody ProfileUpdateRequest request) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		// 토큰에서 역할 확인
		String role = jwtUtil.getRole(token);
		if (!Role.USER.name().equals(role)) {
			throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
		}
		
		// 토큰에서 사용자명 추출
		String username = jwtUtil.getUsername(token);
		User user = userService.updateProfile(username, request.getName(), request.getEmail(), request.getAvatarUrl());
		
		// 비밀번호는 응답에서 제외
		user.setPassword("");
		
		return ResponseEntity.ok(ApiResponse.ok(user));
	}

	@Operation(summary = "비밀번호 변경", description = "현재 로그인한 관리자의 비밀번호를 변경합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "변경 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청 또는 현재 비밀번호 불일치"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PutMapping("/password")
	public ResponseEntity<ApiResponse<Void>> changePassword(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
			@Valid @RequestBody PasswordChangeRequest request) {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		// 토큰에서 역할 확인
		String role = jwtUtil.getRole(token);
		if (!Role.USER.name().equals(role)) {
			throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
		}
		
		// 토큰에서 사용자명 추출
		String username = jwtUtil.getUsername(token);
		userService.changePassword(username, request.getCurrentPassword(), request.getNewPassword());
		
		return ResponseEntity.ok(ApiResponse.ok());
	}

	@Operation(summary = "프로필 이미지 업로드", description = "현재 로그인한 관리자의 프로필 이미지를 업로드합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "업로드 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 필요")
	})
	@SecurityRequirement(name = "bearerAuth")
	@PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<Map<String, Object>>> uploadProfileImage(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
			@RequestPart("file") MultipartFile file) throws IOException {
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			throw new IllegalArgumentException("인증 토큰이 필요합니다.");
		}
		String token = authorization.substring(7);
		
		try {
			// 토큰에서 역할 확인
			String role = jwtUtil.getRole(token);
			if (!Role.USER.name().equals(role)) {
				throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
			}
			
			// 토큰에서 사용자명 추출
			String username = jwtUtil.getUsername(token);
			User user = userService.findByUsername(username)
					.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
			
			// 파일 타입 확인 (이미지만 허용)
			if (!file.getContentType().startsWith("image/")) {
				throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
			}
			
			// 파일 크기 확인 (5MB 제한)
			if (file.getSize() > 5 * 1024 * 1024) {
				throw new IllegalArgumentException("파일 크기는 5MB 이하여야 합니다.");
			}
			
			// 저장 디렉토리 경로: 프로젝트 루트/data/admin/profile/[id]/
			Path baseDir = Paths.get(System.getProperty("user.dir"), "data", "admin", "profile");
			Path profileDir = baseDir.resolve(user.getId());
			Files.createDirectories(profileDir);
			
			// 파일명 생성 (원본 파일명 유지하되 UUID 추가)
			String originalFilename = file.getOriginalFilename();
			String extension = "";
			if (originalFilename != null && originalFilename.contains(".")) {
				extension = originalFilename.substring(originalFilename.lastIndexOf("."));
			}
			String filename = UUID.randomUUID().toString() + extension;
			
			// 파일 저장
			Path target = profileDir.resolve(filename);
			Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
			
			// 파일 URL 생성
			String fileUrl = "/api/v1/admin/profile/avatar/" + user.getId() + "/" + filename;
			
			// 프로필에 이미지 URL 저장
			userService.updateProfile(username, user.getName(), user.getEmail(), fileUrl);
			
			return ResponseEntity.ok(ApiResponse.ok(Map.of(
				"url", fileUrl,
				"filename", filename,
				"size", file.getSize()
			)));
		} catch (Exception e) {
			// JWT 토큰 검증 실패 또는 만료
			if (e instanceof IllegalArgumentException) {
				throw e;
			}
			throw new IllegalArgumentException("유효하지 않은 토큰입니다. 다시 로그인해주세요.");
		}
	}

	@Operation(summary = "프로필 이미지 조회", description = "관리자의 프로필 이미지를 조회합니다. Authorization 헤더는 선택사항입니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공", content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "image/*")),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "이미지를 찾을 수 없음")
	})
	@GetMapping("/avatar/{userId}/{filename}")
	public ResponseEntity<org.springframework.core.io.Resource> getProfileImage(
			@PathVariable("userId") String userId,
			@PathVariable("filename") String filename,
			HttpServletRequest request) {
		
		// Authorization 헤더가 있으면 토큰 검증 수행
		String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (authorization != null && authorization.startsWith("Bearer ")) {
			String token = authorization.substring(7);
			try {
				// 토큰에서 역할 확인
				String role = jwtUtil.getRole(token);
				if (!Role.USER.name().equals(role)) {
					throw new IllegalArgumentException("관리자(USER) 권한이 필요합니다.");
				}
				
				// 토큰에서 사용자명 추출하여 userId와 일치하는지 확인 (선택적 검증)
				String username = jwtUtil.getUsername(token);
				User user = userService.findByUsername(username)
						.orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
				// userId가 토큰의 사용자 ID와 일치하는지 확인 (보안 강화)
				if (!user.getId().equals(userId)) {
					throw new IllegalArgumentException("다른 사용자의 프로필 이미지는 조회할 수 없습니다.");
				}
			} catch (IllegalArgumentException e) {
				throw e;
			} catch (Exception e) {
				// 토큰 검증 실패 시에도 이미지 조회는 허용 (브라우저에서 직접 접근 가능하도록)
				// 하지만 파일 경로에 userId가 포함되어 있으므로 보안상 문제는 없음
			}
		}
		
		try {
			
			// 파일 경로 (프로젝트 루트 기준)
			Path baseDir = Paths.get(System.getProperty("user.dir"), "data", "admin", "profile");
			Path filePath = baseDir.resolve(userId).resolve(filename);
			
			// 파일 존재 확인
			if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
				return ResponseEntity.notFound().build();
			}
			
			// 파일 읽기 가능 여부 확인
			if (!Files.isReadable(filePath)) {
				throw new IllegalArgumentException("파일을 읽을 수 없습니다.");
			}
			
			org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(filePath.toFile());
			
			// Resource 존재 확인
			if (!resource.exists() || !resource.isReadable()) {
				return ResponseEntity.notFound().build();
			}
			
			// Content-Type 설정
			String contentType = "image/jpeg"; // 기본값
			try {
				String detectedType = Files.probeContentType(filePath);
				if (detectedType != null && !detectedType.isEmpty()) {
					contentType = detectedType;
				} else {
					// 파일 확장자로 Content-Type 추정
					String lowerFilename = filename.toLowerCase();
					if (lowerFilename.endsWith(".png")) {
						contentType = "image/png";
					} else if (lowerFilename.endsWith(".gif")) {
						contentType = "image/gif";
					} else if (lowerFilename.endsWith(".webp")) {
						contentType = "image/webp";
					}
				}
			} catch (IOException e) {
				// Content-Type 감지 실패 시 기본값 사용
			}
			
			return ResponseEntity.ok()
					.contentType(MediaType.parseMediaType(contentType))
					.header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
					.body(resource);
		} catch (IllegalArgumentException e) {
			// 명시적인 IllegalArgumentException은 그대로 전달
			throw e;
		} catch (Exception e) {
			// 기타 예외는 로깅하고 일반 오류 메시지 반환
			e.printStackTrace();
			throw new IllegalArgumentException("이미지를 불러오는 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
}

