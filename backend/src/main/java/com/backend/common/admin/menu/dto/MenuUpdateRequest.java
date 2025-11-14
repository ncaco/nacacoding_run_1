package com.backend.common.admin.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MenuUpdateRequest {
	@NotBlank
	private String name;
	
	private String url;
	
	@NotNull
	private Integer displayOrder;
	
	private String parentId;
	
	private Boolean enabled;
	
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getUrl() { return url; }
	public void setUrl(String url) { this.url = url; }
	public Integer getDisplayOrder() { return displayOrder; }
	public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
	public String getParentId() { return parentId; }
	public void setParentId(String parentId) { this.parentId = parentId; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

