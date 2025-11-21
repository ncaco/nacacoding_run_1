package com.backend.common.admin.icon.dto;

import jakarta.validation.constraints.NotBlank;

public class IconUpdateRequest {
	@NotBlank
	private String name;
	
	@NotBlank
	private String svgCode;
	
	private Boolean enabled;
	
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getSvgCode() { return svgCode; }
	public void setSvgCode(String svgCode) { this.svgCode = svgCode; }
	public Boolean getEnabled() { return enabled; }
	public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}

