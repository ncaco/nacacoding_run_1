package com.backend.core.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "API 공통 응답")
public class ApiResponse<T> {
	@Schema(description = "성공 여부", example = "true")
	private boolean success;
	
	@Schema(description = "응답 메시지", example = "OK")
	private String message;
	
	@Schema(description = "응답 데이터")
	private T data;

	public ApiResponse() {}
	public ApiResponse(boolean success, String message, T data) {
		this.success = success;
		this.message = message;
		this.data = data;
	}

	public static <T> ApiResponse<T> ok(T data) {
		return new ApiResponse<>(true, "OK", data);
	}
	public static ApiResponse<Void> ok() {
		return new ApiResponse<>(true, "OK", null);
	}
	public static ApiResponse<Void> error(String message) {
		return new ApiResponse<>(false, message, null);
	}

	public boolean isSuccess() { return success; }
	public void setSuccess(boolean success) { this.success = success; }
	public String getMessage() { return message; }
	public void setMessage(String message) { this.message = message; }
	public T getData() { return data; }
	public void setData(T data) { this.data = data; }
}


