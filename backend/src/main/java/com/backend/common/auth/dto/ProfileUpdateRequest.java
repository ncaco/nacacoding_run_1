package com.backend.common.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ProfileUpdateRequest {
	@NotBlank(message = "이름은 필수입니다.")
	private String name;
	
	@NotBlank(message = "이메일은 필수입니다.")
	@Email(message = "유효한 이메일 주소를 입력하세요.")
	private String email;
	
	private String avatarUrl;
	
	public ProfileUpdateRequest() {}
	
	public ProfileUpdateRequest(String name, String email) {
		this.name = name;
		this.email = email;
	}
	
	public ProfileUpdateRequest(String name, String email, String avatarUrl) {
		this.name = name;
		this.email = email;
		this.avatarUrl = avatarUrl;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getAvatarUrl() {
		return avatarUrl;
	}
	
	public void setAvatarUrl(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}
}

