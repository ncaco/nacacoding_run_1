package com.backend.common.admin.userRoleMenu.dto;

import java.util.List;

public class MenuPermissionResponse {
	private String userRoleId;
	private String userRoleName;
	private List<MenuPermissionItem> menus;

	public MenuPermissionResponse() {}

	public MenuPermissionResponse(String userRoleId, String userRoleName, List<MenuPermissionItem> menus) {
		this.userRoleId = userRoleId;
		this.userRoleName = userRoleName;
		this.menus = menus;
	}

	public String getUserRoleId() { return userRoleId; }
	public void setUserRoleId(String userRoleId) { this.userRoleId = userRoleId; }
	public String getUserRoleName() { return userRoleName; }
	public void setUserRoleName(String userRoleName) { this.userRoleName = userRoleName; }
	public List<MenuPermissionItem> getMenus() { return menus; }
	public void setMenus(List<MenuPermissionItem> menus) { this.menus = menus; }

	public static class MenuPermissionItem {
		private String menuId;
		private String siteId;
		private String menuName;
		private String menuUrl;
		private String parentId;
		private Integer displayOrder;
		private Boolean permRead = false;
		private Boolean permCreate = false;
		private Boolean permUpdate = false;
		private Boolean permDelete = false;
		private Boolean permDownload = false;
		private Boolean permAll = false;

		public MenuPermissionItem() {}

		public MenuPermissionItem(String menuId, String siteId, String menuName, String menuUrl, String parentId, Integer displayOrder, 
			Boolean permRead, Boolean permCreate, Boolean permUpdate, Boolean permDelete, Boolean permDownload, Boolean permAll) {
			this.menuId = menuId;
			this.siteId = siteId;
			this.menuName = menuName;
			this.menuUrl = menuUrl;
			this.parentId = parentId;
			this.displayOrder = displayOrder;
			this.permRead = permRead != null ? permRead : false;
			this.permCreate = permCreate != null ? permCreate : false;
			this.permUpdate = permUpdate != null ? permUpdate : false;
			this.permDelete = permDelete != null ? permDelete : false;
			this.permDownload = permDownload != null ? permDownload : false;
			this.permAll = permAll != null ? permAll : false;
		}

		public String getMenuId() { return menuId; }
		public void setMenuId(String menuId) { this.menuId = menuId; }
		public String getSiteId() { return siteId; }
		public void setSiteId(String siteId) { this.siteId = siteId; }
		public String getMenuName() { return menuName; }
		public void setMenuName(String menuName) { this.menuName = menuName; }
		public String getMenuUrl() { return menuUrl; }
		public void setMenuUrl(String menuUrl) { this.menuUrl = menuUrl; }
		public String getParentId() { return parentId; }
		public void setParentId(String parentId) { this.parentId = parentId; }
		public Integer getDisplayOrder() { return displayOrder; }
		public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
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

