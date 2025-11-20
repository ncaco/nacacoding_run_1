package com.backend.common.admin.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MenuCreateRequest {
	@NotBlank
	private String siteId;
	
	@NotBlank
	private String name;
	
	private String url;
	
	private String icon;
	
	@NotNull
	private Integer displayOrder = 0;
	
	private String parentId;
	
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
}

