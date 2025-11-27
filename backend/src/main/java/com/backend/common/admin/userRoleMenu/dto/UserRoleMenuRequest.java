package com.backend.common.admin.userRoleMenu.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class UserRoleMenuRequest {
	@NotBlank
	private String userRoleId;
	
	private List<MenuPermission> menuPermissions;

	public UserRoleMenuRequest() {}

	public UserRoleMenuRequest(String userRoleId, List<MenuPermission> menuPermissions) {
		this.userRoleId = userRoleId;
		this.menuPermissions = menuPermissions;
	}

	public String getUserRoleId() { return userRoleId; }
	public void setUserRoleId(String userRoleId) { this.userRoleId = userRoleId; }
	public List<MenuPermission> getMenuPermissions() { return menuPermissions; }
	public void setMenuPermissions(List<MenuPermission> menuPermissions) { this.menuPermissions = menuPermissions; }

	public static class MenuPermission {
		private String menuId;
		private Boolean permRead = false;
		private Boolean permCreate = false;
		private Boolean permUpdate = false;
		private Boolean permDelete = false;
		private Boolean permDownload = false;
		private Boolean permAll = false;

		public MenuPermission() {}

		public String getMenuId() { return menuId; }
		public void setMenuId(String menuId) { this.menuId = menuId; }
		public Boolean getPermRead() { return permRead; }
		public void setPermRead(Boolean permRead) { this.permRead = permRead; }
		public Boolean getPermCreate() { return permCreate; }
		public void setPermCreate(Boolean permCreate) { this.permCreate = permCreate; }
		public Boolean getPermUpdate() { return permUpdate; }
		public void setPermUpdate(Boolean permUpdate) { this.permUpdate = permUpdate; }
		public Boolean getPermDelete() { return permDelete; }
		public void setPermDelete(Boolean permDelete) { this.permDelete = permDelete; }
		public Boolean getPermDownload() { return permDownload; }
		public void setPermDownload(Boolean permDownload) { this.permDownload = permDownload; }
		public Boolean getPermAll() { return permAll; }
		public void setPermAll(Boolean permAll) { this.permAll = permAll; }
	}
}

