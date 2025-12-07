package com.backend.common.user.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "사용자 정보")
public class User {
	@Schema(description = "사용자 ID", example = "user-id-123")
	private String id;
	
	@Schema(description = "사용자명", example = "admin")
	@NotBlank
	private String username;
	
	@Schema(description = "비밀번호 (응답 시 제외됨)", example = "****", accessMode = Schema.AccessMode.WRITE_ONLY)
	@NotBlank
	private String password;
	
	@Schema(description = "역할", example = "USER", allowableValues = {"USER", "MEMBER"})
	private Role role;
	
	@Schema(description = "이름", example = "홍길동")
	private String name;
	
	@Schema(description = "이메일", example = "admin@example.com")
	private String email;
	
	@Schema(description = "프로필 이미지 URL", example = "/api/v1/admin/profile/avatar/user-id-123/image.jpg")
	private String avatarUrl;
	
	@Schema(description = "사용자 역할 ID", example = "role-id-123")
	private String userRoleId;

	public User() {}

	public User(String id, String username, String password, Role role) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.role = role;
	}
	
	public User(String id, String username, String password, Role role, String name, String email) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.role = role;
		this.name = name;
		this.email = email;
	}
	
	public User(String id, String username, String password, Role role, String name, String email, String avatarUrl) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.role = role;
		this.name = name;
		this.email = email;
		this.avatarUrl = avatarUrl;
	}
	
	public User(String id, String username, String password, Role role, String name, String email, String avatarUrl, String userRoleId) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.role = role;
		this.name = name;
		this.email = email;
		this.avatarUrl = avatarUrl;
		this.userRoleId = userRoleId;
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
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
	public String getAvatarUrl() { return avatarUrl; }
	public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
	public String getUserRoleId() { return userRoleId; }
	public void setUserRoleId(String userRoleId) { this.userRoleId = userRoleId; }
}


