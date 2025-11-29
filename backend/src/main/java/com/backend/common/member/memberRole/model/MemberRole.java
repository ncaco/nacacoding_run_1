package com.backend.common.member.memberRole.model;

import jakarta.validation.constraints.NotBlank;

public class MemberRole {
	private String id;
	
	@NotBlank
	private String roleCd;
	
	@NotBlank
	private String roleNm;
	
	private String roleDesc;
	
	private Boolean enabled;
	
	public MemberRole() {}
	
	public MemberRole(String id, String roleCd, String roleNm, String roleDesc, Boolean enabled) {
		this.id = id;
		this.roleCd = roleCd;
		this.roleNm = roleNm;
		this.roleDesc = roleDesc;
		this.enabled = enabled;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getRoleCd() { return roleCd; }
	public void setRoleCd(String roleCd) { this.roleCd = roleCd; }
	public String getRoleNm() { return roleNm; }
	public void setRoleNm(String roleNm) { this.roleNm = roleNm; }
	public String getRoleDesc() { return roleDesc; }
	public void setRoleDesc(String roleDesc) { this.roleDesc = roleDesc; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

