package com.backend.common.admin.cmnCd.dto;

import jakarta.validation.constraints.NotBlank;

public class CmnCdUpdateRequest {
	@NotBlank(message = "명칭은 필수입니다.")
	private String name;
	
	private String description;
	
	private Boolean enabled;
	
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

