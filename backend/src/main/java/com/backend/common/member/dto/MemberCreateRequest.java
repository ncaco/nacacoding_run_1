package com.backend.common.member.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Schema(description = "사용자 생성 요청")
public class MemberCreateRequest {
	@Schema(description = "사용자명", example = "newuser", required = true)
	@NotBlank(message = "사용자명은 필수입니다")
	private String username;
	
	@Schema(description = "비밀번호", example = "password123", required = true)
	@NotBlank(message = "비밀번호는 필수입니다")
	private String password;
	
	@Schema(description = "이름", example = "홍길동")
	private String name;
	
	@Schema(description = "이메일", example = "user@example.com")
	private String email;
	
	@Schema(description = "전화번호", example = "010-1234-5678")
	private String phoneNumber;
	
	@Schema(description = "가입 일시 (미지정 시 서버에서 현재 시간으로 처리)", example = "2024-01-01T00:00:00")
	// 가입 일시 (관리자에서 직접 지정 가능, 미지정 시 서버에서 현재 시간으로 처리)
	private LocalDateTime createdAt;

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
	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
