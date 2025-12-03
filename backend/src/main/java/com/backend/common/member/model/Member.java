package com.backend.common.member.model;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class Member {
	private String id;
	@NotBlank
	private String username;
	@NotBlank
	private String password;
	private String name;
	private String email;
	private String avatarUrl;
	private LocalDateTime createdAt;
	private LocalDateTime lastLoginAt;

	public Member() {}
	
	public Member(String id, String username, String password) {
		this.id = id;
		this.username = username;
		this.password = password;
	}
	
	public Member(String id, String username, String password, String name, String email) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
	}
	
	public Member(String id, String username, String password, String name, String email, String avatarUrl) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
		this.avatarUrl = avatarUrl;
	}

	public Member(String id, String username, String password, String name, String email, String avatarUrl,
	              LocalDateTime createdAt, LocalDateTime lastLoginAt) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.name = name;
		this.email = email;
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
	public String getAvatarUrl() { return avatarUrl; }
	public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
	public LocalDateTime getLastLoginAt() { return lastLoginAt; }
	public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}

