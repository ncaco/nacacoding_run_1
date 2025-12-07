package com.backend.common.user.dto;

import com.backend.common.user.model.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "관리자 생성 요청")
public class UserCreateRequest {
	@Schema(description = "사용자명", example = "newadmin", required = true)
	@NotBlank(message = "사용자명은 필수입니다")
	private String username;
	
	@Schema(description = "비밀번호", example = "password123", required = true)
	@NotBlank(message = "비밀번호는 필수입니다")
	private String password;
	
	@Schema(description = "역할", example = "USER", allowableValues = {"USER", "MEMBER"})
	private Role role;
	
	@Schema(description = "이름", example = "홍길동")
	private String name;
	
	@Schema(description = "이메일", example = "admin@example.com")
	private String email;
	
	@Schema(description = "사용자 역할 ID", example = "role-id-123")
	private String userRoleId;

	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	public Role getRole() { return role; }
	public void setRole(Role role) { this.role = role; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getUserRoleId() { return userRoleId; }
	public void setUserRoleId(String userRoleId) { this.userRoleId = userRoleId; }
}
