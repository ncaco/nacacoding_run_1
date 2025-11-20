package com.backend.common.admin.menu.model;

import jakarta.validation.constraints.NotBlank;

public class Menu {
	private String id;
	private String siteId;
	@NotBlank
	private String name;
	private String url;
	private String icon;
	private Integer displayOrder;
	private String parentId;
	private Boolean enabled;
	
	public Menu() {}
	
	public Menu(String id, String siteId, String name, String url, String icon, Integer displayOrder, String parentId, Boolean enabled) {
		this.id = id;
		this.siteId = siteId;
		this.name = name;
		this.url = url;
		this.icon = icon;
		this.displayOrder = displayOrder;
		this.parentId = parentId;
		this.enabled = enabled;
	}
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	public String getSiteId() { return siteId; }
	public void setSiteId(String siteId) { this.siteId = siteId; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getUrl() { return url; }
	public void setUrl(String url) { this.url = url; }
	public String getIcon() { return icon; }
	public void setIcon(String icon) { this.icon = icon; }
	public Integer getDisplayOrder() { return displayOrder; }
	public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
	public String getParentId() { return parentId; }
	public void setParentId(String parentId) { this.parentId = parentId; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

