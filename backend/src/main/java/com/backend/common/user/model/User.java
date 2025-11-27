package com.backend.common.user.model;

import jakarta.validation.constraints.NotBlank;

public class User {
	private String id;
	@NotBlank
	private String username;
	@NotBlank
	private String password;
	private Role role;
	private String name;
	private String email;
	private String avatarUrl;
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


