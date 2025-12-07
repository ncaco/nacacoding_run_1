package com.backend.common.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 응답")
public class LoginResponse {
	@Schema(description = "Access Token (JWT)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
	private String token;
	
	@Schema(description = "Refresh Token (JWT)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
	private String refreshToken;

	public LoginResponse() {}
	
	public LoginResponse(String token) {
		this.token = token;
	}
	
	public LoginResponse(String token, String refreshToken) {
		this.token = token;
		this.refreshToken = refreshToken;
	}
	
	public String getToken() { return token; }
	public void setToken(String token) { this.token = token; }
	
	public String getRefreshToken() { return refreshToken; }
	public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}


