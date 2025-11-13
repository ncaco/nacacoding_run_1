package com.backend.common.member.model;

import jakarta.validation.constraints.NotBlank;

public class Member {
	private String id;
	@NotBlank
	private String username;
	@NotBlank
	private String password;

	public Member() {}
	
	public Member(String id, String username, String password) {
		this.id = id;
		this.username = username;
		this.password = password;
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
}

