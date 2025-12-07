package com.backend.common.member.dto;

import jakarta.validation.constraints.NotBlank;

public class MemberPasswordChangeRequest {
	@NotBlank(message = "현재 비밀번호는 필수입니다")
	private String currentPassword;
	
	@NotBlank(message = "신규 비밀번호는 필수입니다")
	private String newPassword;
	
	@NotBlank(message = "비밀번호 확인은 필수입니다")
	private String confirmPassword;

	public String getCurrentPassword() { return currentPassword; }
	public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
	public String getNewPassword() { return newPassword; }
	public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
	public String getConfirmPassword() { return confirmPassword; }
	public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}
