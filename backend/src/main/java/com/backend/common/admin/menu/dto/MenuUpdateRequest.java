package com.backend.common.admin.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MenuUpdateRequest {
	@NotBlank
	private String name;
	
	private String url;
	
	private String icon;
	
	@NotNull
	private Integer displayOrder;
	
	private String parentId;
	
	private Boolean enabled;
	
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

