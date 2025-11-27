package com.backend.common.admin.userRoleMenu.model;

public class UserRoleMenu {
	private String id;
	private String userRoleId;
	private String menuId;
	private Boolean enabled;

	public UserRoleMenu() {}

	public UserRoleMenu(String id, String userRoleId, String menuId, Boolean enabled) {
		this.id = id;
		this.userRoleId = userRoleId;
		this.menuId = menuId;
		this.enabled = enabled;
	}

	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getUserRoleId() { return userRoleId; }
	public void setUserRoleId(String userRoleId) { this.userRoleId = userRoleId; }
	public String getMenuId() { return menuId; }
	public void setMenuId(String menuId) { this.menuId = menuId; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

