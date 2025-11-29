package com.backend.common.member.memberRole.dto;

import jakarta.validation.constraints.NotBlank;

public class MemberRoleCreateRequest {
	@NotBlank(message = "역할 코드는 필수입니다.")
	private String roleCd;
	
	@NotBlank(message = "역할명은 필수입니다.")
	private String roleNm;
	
	private String roleDesc;
	
	private Boolean enabled = true;
	
	public String getRoleCd() { return roleCd; }
	public void setRoleCd(String roleCd) { this.roleCd = roleCd; }
	public String getRoleNm() { return roleNm; }
	public void setRoleNm(String roleNm) { this.roleNm = roleNm; }
	public String getRoleDesc() { return roleDesc; }
	public void setRoleDesc(String roleDesc) { this.roleDesc = roleDesc; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

