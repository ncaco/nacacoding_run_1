package com.backend.common.member.memberRole.dto;

import jakarta.validation.constraints.NotBlank;

public class MemberRoleUpdateRequest {
	@NotBlank(message = "역할명은 필수입니다.")
	private String roleNm;
	
	private String roleDesc;
	
	private Boolean enabled;
	
	public String getRoleNm() { return roleNm; }
	public void setRoleNm(String roleNm) { this.roleNm = roleNm; }
	public String getRoleDesc() { return roleDesc; }
	public void setRoleDesc(String roleDesc) { this.roleDesc = roleDesc; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

