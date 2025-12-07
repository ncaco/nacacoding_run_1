package com.backend.common.member.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Schema(description = "사용자 정보")
public class Member {
	@Schema(description = "사용자 ID", example = "member-id-123")
	private String id;
	
	@Schema(description = "사용자명", example = "user")
	@NotBlank
	private String username;
	
	@Schema(description = "비밀번호 (응답 시 제외됨)", example = "****", accessMode = Schema.AccessMode.WRITE_ONLY)
	@NotBlank
	private String password;
	
	@Schema(description = "이름", example = "홍길동")
	private String name;
	
	@Schema(description = "이메일", example = "user@example.com")
	private String email;
	
	@Schema(description = "전화번호", example = "010-1234-5678")
	private String phoneNumber;
	
	@Schema(description = "프로필 이미지 URL", example = "/api/v1/members/avatar/member-id-123/image.jpg")
	private String avatarUrl;
	
	@Schema(description = "가입 일시", example = "2024-01-01T00:00:00")
	private LocalDateTime createdAt;
	
	@Schema(description = "마지막 로그인 일시", example = "2024-01-15T10:30:00")
	private LocalDateTime lastLoginAt;

	public Member() {}
	
	public Member(String id, String username, String password) {
		this.id = id;
		this.username = username;
		this.password = password;
	}
	
	public Member(String id, String username, String password, String name, String email, String phoneNumber) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
	}
	
	public Member(String id, String username, String password, String name, String email, String phoneNumber, String avatarUrl) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.avatarUrl = avatarUrl;
	}

	public Member(String id, String username, String password, String name, String email, String phoneNumber, String avatarUrl,
	              LocalDateTime createdAt, LocalDateTime lastLoginAt) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.avatarUrl = avatarUrl;
		this.createdAt = createdAt;
		this.lastLoginAt = lastLoginAt;
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getPhoneNumber() { return phoneNumber; }
	public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
	public String getAvatarUrl() { return avatarUrl; }
	public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
	public LocalDateTime getLastLoginAt() { return lastLoginAt; }
	public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}

