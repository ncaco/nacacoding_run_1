package com.backend.common.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "로그인 요청")
public class LoginRequest {
	@Schema(description = "사용자명", example = "admin", required = true)
	@NotBlank(message = "사용자명은 필수입니다")
	private String username;
	
	@Schema(description = "비밀번호", example = "admin123", required = true)
	@NotBlank(message = "비밀번호는 필수입니다")
	private String password;

	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
}


