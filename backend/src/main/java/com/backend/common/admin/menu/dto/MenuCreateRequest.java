package com.backend.common.admin.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MenuCreateRequest {
	@NotBlank(message = "사이트 ID는 필수입니다")
	private String siteId;
	
	@NotBlank(message = "메뉴명은 필수입니다")
	private String name;
	
	private String url;
	
	private String icon;
	
	@NotNull(message = "표시 순서는 필수입니다")
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

