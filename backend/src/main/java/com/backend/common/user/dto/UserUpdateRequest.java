package com.backend.common.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "관리자 수정 요청")
public class UserUpdateRequest {
	@Schema(description = "이름", example = "홍길동")
	private String name;
	
	@Schema(description = "이메일", example = "admin@example.com")
	private String email;
	
	@Schema(description = "사용자 역할 ID", example = "role-id-123")
	private String userRoleId;

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getUserRoleId() { return userRoleId; }
	public void setUserRoleId(String userRoleId) { this.userRoleId = userRoleId; }
}
