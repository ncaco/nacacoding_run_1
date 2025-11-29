package com.backend.common.member.memberRoleMenu.model;

public class MemberRoleMenu {
	private String id;
	private String memberRoleId;
	private String menuId;
	private Boolean enabled;

	public MemberRoleMenu() {}

	public MemberRoleMenu(String id, String memberRoleId, String menuId, Boolean enabled) {
		this.id = id;
		this.memberRoleId = memberRoleId;
		this.menuId = menuId;
		this.enabled = enabled;
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getMemberRoleId() { return memberRoleId; }
	public void setMemberRoleId(String memberRoleId) { this.memberRoleId = memberRoleId; }
	public String getMenuId() { return menuId; }
	public void setMenuId(String menuId) { this.menuId = menuId; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

