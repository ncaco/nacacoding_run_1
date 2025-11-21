package com.backend.common.admin.icon.dto;

import jakarta.validation.constraints.NotBlank;

public class IconCreateRequest {
	@NotBlank
	private String iconId;
	
	@NotBlank
	private String name;
	
	@NotBlank
	private String svgCode;
	
	public String getIconId() { return iconId; }
	public void setIconId(String iconId) { this.iconId = iconId; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getSvgCode() { return svgCode; }
	public void setSvgCode(String svgCode) { this.svgCode = svgCode; }
}

